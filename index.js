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
 * @description: creates "n" number of com
 * @param: numOfCompetitors (integer) - the total amount of competitors in a tournament
 * @returns: allCompetitors
 **/
function generateCompetitors(numOfCompetitors){
	let outputArr = [];

	for (let i=0; i<numOfCompetitors ;i++ ){
    let competitorBlueprint = '{"c' + (i+1).toString() + '":{"rating":1600,"wins":0,"losses":0,"compHistory":"","record":""}}';

    outputArr.push(JSON.parse(competitorBlueprint))
	}

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

	console.log("here's randomNumber>>>>",randomNumber)
	console.log("probabilityOfVictoryLeft>>>>",probabilityOfVictoryLeft)
	console.log("probabilityOfVictoryRight>>>>",probabilityOfVictoryRight)

	if (probabilityOfVictoryLeft>randomNumber) {
		console.log("leftSide won!")
		recordResult(competitionMats,leftPointsArr[0],rightPointsArr[1],"w","l")

	} else {
		console.log("rightSide won!")
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
	
	console.log("the competitionMats>>>",competitionMats)
	console.log("the pointsAtStakeLeft>>>",pointsAtStakeLeft)
	console.log("the pointsAtStakeRight>>>",pointsAtStakeRight)

	competitionMats.forEach(function(competitor,index){
		let competitorStats = Object.keys(competitor)
		console.log("competitor>>",competitor)

		//this recursively adds points to their rating
		competitor[competitorStats].rating = competitor[competitorStats].rating + [pointsAtStakeLeft,pointsAtStakeRight][index]
		//this recursively tallies their wins and losses
		competitor[competitorStats].compHistory = competitor[competitorStats].compHistory + [leftResult,rightResult][index]
		console.log(competitor[competitorStats])

		writeToTheirRecord(competitor,competitor[competitorStats],[leftResult,rightResult])


	})


}

function writeToTheirRecord(competitor,competitorBody,letterResultsArr){
	console.log("competitorBody>>",competitorBody)
}

/**
 * @name: runCompetitionMats
 * @description: 
 * @param1: tuple (the competition mats)
 * @param2: kFactor 
 * @param3: classSize
 * @returns: allCompetitors
 **/
function runCompetitionMats (tuple,kFactor,classSize){
	//this accesses the competitor information
	let leftSideComp  = tuple[0][Object.keys(tuple[0])[0]];
	let rightSideComp = tuple[1][Object.keys(tuple[1])[0]];

	let leftSideProbabilityOfVictory  = 1 / (1+Math.pow(10, ((rightSideComp.rating-leftSideComp.rating) /classSize) ))
	let rightSideProbabilityOfVictory = 1 / (1+Math.pow(10, (( leftSideComp.rating-rightSideComp.rating)/classSize) ))
	
	// [pointsLeftSideWillGain, pointsLeftSideWillLose]
	let leftSidePoints  = calculatePointsAtStake(leftSideProbabilityOfVictory,kFactor)	
	let rightSidePoints = calculatePointsAtStake(rightSideProbabilityOfVictory,kFactor)	

	console.log("leftSidePoints>>>",leftSidePoints)
	console.log("rightSidePoints>>>",rightSidePoints)

	decideWinner(tuple,leftSideProbabilityOfVictory,rightSideProbabilityOfVictory,leftSidePoints,rightSidePoints)

	//calculated points to be lost or won


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
	return [(1-probabilityOfVictory),-probabilityOfVictory].map(function(outcomeProbability,index){
		return kFactor*outcomeProbability
	})
}

/**
 * @name: makeAllCompete
 * @description: 
 * @param: 
 * @returns:
 **/
function makeAllCompete(numberOfRounds,everySingleCompetitorArr,kFactor,classSize){
	// console.log("numberOfRounds>>>>",numberOfRounds);
	// console.log("everySingleCompetitorArr>>>>",everySingleCompetitorArr);

	//make them compete
	//return them to the finishedCompeting line

	// this will run once for each number of rounds
	// for (let i = 1;i<numberOfRounds+1;i++){
	// 	console.log("this is the round number",i)
	// }

	let finishedArr = [];
	let compMats = [];

	for (let j = 0; j < everySingleCompetitorArr.length;j++){
		//we need to isolate two competitors from the bullPen (aka everySingleCompetitorArr)
		compMats.push(everySingleCompetitorArr.pop(),everySingleCompetitorArr.pop())

		// console.log("compMats",compMats)

		//take two competitors out of everySingleCompetitorArr

		runCompetitionMats(compMats,kFactor,classSize)

		//pick random number
		//declare a competitor the winner
		//increment their stats
		//push them into finishedArr



		//we need a scorekeeper
		//we need competition mats

		finishedArr.push(compMats.pop(),compMats.pop())
	}

	console.log("these competitors finished competing",finishedArr)






	//what needs to happen to make two competitors compete?

	//make competitors compete 
	






}


/**
 * @name: runTournament
 * @description: Calculates the elo rating of bjj competitors after a tournament
 * @param: roundNum (integer) - the amount of tournament rounds for each bjj competitor
 * @param: tournSize (integer) - the amount of bjj competitors
 * @returns: results of tournament
 **/
function runTournament(roundNum,tournSize,kFactor,classSize){
	console.log("running a tournament of !!!",roundNum,"rounds !!!")
	console.log("and                     !!!",tournSize,"competitors !!!")

	//this line will create all competitorObjs
	//and put them in an array
	//generateCompetitors(tournSize)

	//make them compete
	makeAllCompete(roundNum,generateCompetitors(tournSize),kFactor,classSize)


	//afterward I'll have some interesting choices:

	//Choices:
	//1. save competitors to db then run competition again

	//2. or make basic ui?



	// return ...what?
}

//the simplest tournament is two rounds, four competitors
// using 32 as k-factor
//with k-factor
runTournament(2,4,32,400)

