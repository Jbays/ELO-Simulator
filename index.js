'use strict';

const _ = require('underscore');

/**
 * @name: generateCompetitors
 * @description: creates "n" number of competitors
 * @param: numOfCompetitors (integer) - the total amount of competitors in a tournament
 * @returns: allCompetitors
 **/
function generateCompetitors(numOfCompetitors){
	let outputArr = [];

	//for-loop which will generate competitors equaling to numOfCompetitors
	for (let i=0;i<numOfCompetitors;i++){
    let competitorBlueprint = '{"c'+(i+1).toString()+'":{"rating":1600,"record":"0-0","streak":""}}';

    outputArr.push(JSON.parse(competitorBlueprint))
	}

	//10:35am - what to do about competitors's belts??

	return _.shuffle(outputArr)
}

/**
 * @name: recordResult
 * @description: For each competitor on the competitionMats,
 **							 (1). Recursively adds points to their rating
 **							 (2). Tallies their record
 **							 (3). Recursively tallies their streak
 * @param1: competitionMats 
 * @param2: pointsAwarded
 * @param3: matchOutcomeArr
 * @returns: 
 **/
function recordResult(competitionMats,pointsAwarded,matchOutcomeArr){
	competitionMats.forEach(function(competitor,index){
		let competitorNameStr = Object.keys(competitor)
		
		competitor[competitorNameStr].rating = competitor[competitorNameStr].rating + pointsAwarded[index]
		competitor[competitorNameStr].record = writeToTheirRecord(competitor[competitorNameStr].record,matchOutcomeArr[index])
		competitor[competitorNameStr].streak = competitor[competitorNameStr].streak + matchOutcomeArr[index]
	})

	return competitionMats
}

/**
 * @name: writeToTheirRecord
 * @description: Toggles the competitor's record equal to their match result
 * @param1: recordString 
 * @param2: letterResultStr
 * @returns: newlyToggledRecord 
 **/
function writeToTheirRecord(recordString,letterResultStr){
	let splitRecord = recordString.split('-')

	if ( letterResultStr === "w" ) {
		splitRecord[0] = parseInt(splitRecord[0])+1
	} else {//letterResultArr === "l"
		splitRecord[1] = parseInt(splitRecord[1])+1
	}

	return splitRecord.join('-')
}

/**
 * @name: runCompetitionMats
 * @description: Triggers competition.
 **							(1) A winner is declared
 **							(2) Stats for both competitors are toggled
 * @param1: comeptitionMats
 * @param2: victoryProbabilities
 * @param3: pointsAtStake
 * @returns: allCompetitors
 **/
function runCompetitionMats (competitionMats,victoryProbabilities,pointsAtStake){
	//decide winner && record result
	let randomNumber = Math.random()

	//leftSide won!
	if (victoryProbabilities[0]>randomNumber) {
		recordResult(competitionMats,[pointsAtStake[0][0],pointsAtStake[1][1]],["w","l"])
	} else {//rightSide won!
		recordResult(competitionMats,[pointsAtStake[0][1],pointsAtStake[1][0]],["l","w"])
	}

	return competitionMats
}

/**
 * @name: calculateProbabilityOfVictory
 * @description: calculates the probability of victory for each competitor,
 **							 then returns those probabilities in an array
 * @param1: competitionMats
 * @returns: [probabilityOfVictoryForLeft,probabilityOfVictoryForRight]
 **/
function calculateProbabilityOfVictory(competitionMats,classSize){
	let leftSideCompStats  = competitionMats[0][Object.keys(competitionMats[0])[0]];
	let rightSideCompStats = competitionMats[1][Object.keys(competitionMats[1])[0]];

	return [(1/(1+Math.pow(10,((rightSideCompStats.rating- leftSideCompStats.rating)/(2*classSize))))),
					(1/(1+Math.pow(10,(( leftSideCompStats.rating-rightSideCompStats.rating)/(2*classSize)))))]
}

/**
 * @name: calculatePointsAtStake
 * @description: Calculates the amount of points each competitor should:
 **							 (1) Gain in victory
 **							 (2) Lose in defeat							
 * @param1: victoryProbTuple
 * @param2: kFactor 
 * @returns: [pointsGainedInVictory,pointsLostInDefeat]
 **/
function calculatePointsAtStake(victoryProbTuple,kFactor){
	let outputArr = []

	//for each competitor's victoryProbability
	victoryProbTuple.forEach(function(victoryProbability){
		//map kFactor to both victoryProbability and lossProbability
		let pointsAtStake = [victoryProbability,-(1-victoryProbability)].map(function(outcomeProbability){
			return parseInt((kFactor*outcomeProbability).toFixed())
		})

		outputArr.push(pointsAtStake);
	})

	return outputArr
}

/**
 * @name: runTournament
 * @description: Applies ELO rating system to a brazilian jiu-jitsu tournament
 * @param0: numOfRounds (integer) - the amount of tournament rounds for each bjj competitor
 * @param1: numOfCompetitors (integer) - the amount of bjj competitors
 * @param2: kFactor (integer) - the MOST amount of points a competitor can win or loser.
 * @param3: classSize (integer) - the amount of bjj competitors
 * @returns: all competitors after competition
 **/
function runTournament(numOfRounds,numOfCompetitors,kFactor,classSize){
	console.log("running a tournament of !!!",numOfRounds,"rounds !!!")
	console.log("and                     !!!",numOfCompetitors,"competitors !!!")
	let allCompetitorsArr = generateCompetitors(numOfCompetitors);

	//tuplizes first half with second half of allCompetitorsArr
	let tuplizeCompetitors = _.zip(allCompetitorsArr.slice(0,(allCompetitorsArr.length/2)),
														allCompetitorsArr.slice((allCompetitorsArr.length/2),allCompetitorsArr.length));

	//This runs one round of competition for rounds = numOfRounds
	for (let i=1;i<numOfRounds+1;i++) {
		tuplizeCompetitors.forEach(function(competitionMats){

			//calculate probability of victory for each competitor
			let victoryProbTuple  = calculateProbabilityOfVictory(competitionMats,classSize);
			//calculate the points at stake for each competitor
			let pointsStakesTuple = calculatePointsAtStake(victoryProbTuple,kFactor); 
			//NOTE: low likelihood of victory means low points lost & high points gained 
			//high likelihood of victory means high points lost & low points gained 

			runCompetitionMats(competitionMats,victoryProbTuple,pointsStakesTuple)
		})
	}

	return allCompetitorsArr
}

console.log("These are the results of the tournament",runTournament(4,16,32,200));

//NOTE: 5-13-2017
//the 2015 Mundials had 1861 competitors
//whose proportions between belts were:
//if 25 competitors --> = [2,4,7,9,3];
//WHERE index=0 is black belts
//index=1 is brown belts
//...
//index=4 is white belts

// The system is functional IF an 11-round tournament runs with 2048 competitors WITHOUT ERROR
// console.log("These are the results of the tournament",runTournament(11,2048,32,200));