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
 * @description: detects outcome out of 
 * @param1: competitionMats 
 * @param2: pointsAtStakeLeft
 * @param3: pointsAtStakeRight
 * @param4: leftResult
 * @param5: rightResult
 * @returns: 
 **/
function recordResult(competitionMats,pointsAtStakeLeft,pointsAtStakeRight,leftResult,rightResult){
	competitionMats.forEach(function(competitor,index){
		//NOTE: isn't this the competitor's name??
		let competitorStats = Object.keys(competitor)

		//TODO: Can I change the shape of competitor to make accessing key-values easier?

		//this recursively adds points to their rating
		competitor[competitorStats].rating = competitor[competitorStats].rating + [pointsAtStakeLeft,pointsAtStakeRight][index]
		//this recursively tallies their record
		competitor[competitorStats].record = writeToTheirRecord(competitor[competitorStats].record,[leftResult,rightResult][index])
		//this recursively tallies their wins and losses
		competitor[competitorStats].streak = competitor[competitorStats].streak + [leftResult,rightResult][index]
	})
}

/**
 * @name: writeToTheirRecord
 * @description: 
 * @param1: recordString 
 * @param2: letterResultsArr
 * @returns: 
 **/
function writeToTheirRecord(recordString,letterResultsArr){
	let splitRecord = recordString.split('-')

	if ( letterResultsArr === "w" ) {
		splitRecord[0] = parseInt(splitRecord[0])+1
	} else {//letterResultArr === "l"
		splitRecord[1] = parseInt(splitRecord[1])+1
	}

	return splitRecord.join('-')
}

/**
 * @name: runCompetitionMats
 * @description: 
 * @param1: tuple (the competition mats)
 * @param2: kFactor 
 * @param3: classSize
 * @returns: allCompetitors
 **/
function runCompetitionMats (competitionMats,victoryProbabilities,pointsAtStake){
	//decide winner && record result
	let randomNumber = Math.random()

	//leftSide won!
	if (victoryProbabilities[0]>randomNumber) {
		recordResult(competitionMats,pointsAtStake[0][0],pointsAtStake[1][1],"w","l")
	} else {//rightSide won!
		recordResult(competitionMats,pointsAtStake[0][1],pointsAtStake[1][0],"l","w")
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
 * @description: 
 * @param1: probabilityOfVictory
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
 * @description: Calculates the elo rating of bjj competitors after a tournament
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
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	//afterward I'll have some interesting choices:

	//Choices:
	//1. save competitors to db then run competition again

	//2. or make basic ui?

	// return ...what?
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