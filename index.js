'use strict';

const _ = require('underscore');

//NOTE: 5-13-2017
//the 2015 Mundials had 1861 competitors
//whose proportions between belts were:
//if 25 competitors --> = [2,4,7,9,3];
//WHERE index=0 is black belts
//index=1 is brown belts
//...
//index=4 is white belts

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

	_.shuffle(outputArr)

	//10:35am - what to do about competitors's belts??

	return outputArr
}

/**
 * @name: decideWinner
 * @description: This is a referee function.  This function decides who won and who lost.
 * @param1: tuple (the competition mats)
 * @param2: probabilityOfVictoryLeft 
 * @param3: probabilityOfVictoryRight
 * @returns: allCompetitors
 **/
function decideWinner(competitionMats,probabilityOfVictoryLeft,probabilityOfVictoryRight,leftPointsArr,rightPointsArr){
	let randomNumber = Math.random()

	//leftSide won!
	if (probabilityOfVictoryLeft>randomNumber) {
		recordResult(competitionMats,leftPointsArr[0],rightPointsArr[1],"w","l")

	} else {//rightSide won!
		recordResult(competitionMats,leftPointsArr[1],rightPointsArr[0],"l","w")
	}
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
function runCompetitionMats (competitionMats,kFactor,classSize){
	//this accesses the competitor information
	let leftSideComp  = competitionMats[0][Object.keys(competitionMats[0])[0]];
	let rightSideComp = competitionMats[1][Object.keys(competitionMats[1])[0]];

	let leftSideProbabilityOfVictory  = 1 / (1+Math.pow(10, ((rightSideComp.rating- leftSideComp.rating)/(2*classSize) )))
	let rightSideProbabilityOfVictory = 1 / (1+Math.pow(10, (( leftSideComp.rating-rightSideComp.rating)/(2*classSize) )))
	
	// [pointsLeftSideWillGain, pointsLeftSideWillLose]
	let leftSidePoints  = calculatePointsAtStake(leftSideProbabilityOfVictory,kFactor)	
	let rightSidePoints = calculatePointsAtStake(rightSideProbabilityOfVictory,kFactor)	

	return decideWinner(competitionMats,leftSideProbabilityOfVictory,rightSideProbabilityOfVictory,leftSidePoints,rightSidePoints)
}

/**
 * @name: calculatePointsAtStake
 * @description: 
 * @param1: probabilityOfVictory
 * @param2: kFactor 
 * @returns: [pointsGainedInVictory,pointsLostInDefeat]
 **/
function calculatePointsAtStake(probabilityOfVictory,kFactor){
	//NOTE: return array's index=0 is the probability of victory
	//      index=1 is the probability of loss
	return [(1-probabilityOfVictory),-probabilityOfVictory].map(function(outcomeProbability){
		//NOTE: this must return a rounded number
		return parseInt((kFactor*outcomeProbability).toFixed())
	})
}

/**
 * @name: makeAllCompete
 * @description: forEach everySingleCompetitorArr
 * @param: 
 * @returns:
 **/
function makeAllCompete(numberOfRounds,everySingleCompetitorArr,kFactor,classSize){
	// this will run once for each number of rounds
	for (let i = 1;i<numberOfRounds+1;i++){
		console.log("this is the round number",i)
		console.log("participating in this round are competitors>>>>",everySingleCompetitorArr);

		let finishedArr = [];
		let compMats = [];

		for (let j=0;j<everySingleCompetitorArr.length;j++){
			//we need to isolate two competitors from the bullPen (aka everySingleCompetitorArr)
			compMats.push(everySingleCompetitorArr.pop(),everySingleCompetitorArr.pop())
			runCompetitionMats(compMats,kFactor,classSize)
			finishedArr.push(compMats.pop(),compMats.pop())
		}
		everySingleCompetitorArr = finishedArr;
	}

	return everySingleCompetitorArr
}

/**
 * @name: runTournament
 * @description: Calculates the elo rating of bjj competitors after a tournament
 * @param: numOfRounds (integer) - the amount of tournament rounds for each bjj competitor
 * @param: numOfCompetitors (integer) - the amount of bjj competitors
 * @param: kFactor (integer) - the MOST amount of points a competitor can win or loser.
 * @param: classSize (integer) - the amount of bjj competitors
 * @returns: all competitors after competition
 **/
function runTournament(numOfRounds,numOfCompetitors,kFactor,classSize){
	console.log("running a tournament of !!!",numOfRounds,"rounds !!!")
	console.log("and                     !!!",numOfCompetitors,"competitors !!!")
	let allCompetitorsArr = generateCompetitors(numOfCompetitors);
	// console.log("this is the tournament's every competitor>>>>",allCompetitorsArr);

	//tuplizes first half with second half of allCompetitorsArr
	let tuplizeCompetitors = _.zip(allCompetitorsArr.slice(0,(allCompetitorsArr.length/2)),
														allCompetitorsArr.slice((allCompetitorsArr.length/2),allCompetitorsArr.length));

	//This runs one round of competition for rounds = numOfRounds
	for (let i=1;i<numOfRounds+1;i++) {
		tuplizeCompetitors.forEach(function(competitionMats){
			runCompetitionMats(competitionMats,kFactor,classSize)
		})
	}

	return allCompetitorsArr
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	//THIS IS HOW IT ORIGINALLY WORKED!
	//this must return allCompetitors AFTER the competition
	// return makeAllCompete(roundNum,allCompetitors,kFactor,classSize)


	//afterward I'll have some interesting choices:

	//Choices:
	//1. save competitors to db then run competition again

	//2. or make basic ui?

	// return ...what?
}


console.log("These are the results of the tournament",runTournament(11,2048,32,200));