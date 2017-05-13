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


}

function calculatePointsAtStake(probabilityOfVictory,kFactor){
	//NOTE: index=0 is the probability of victory
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

	//for every pair of competitors
	//push them into the competition mats
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

		//calculate likelihood of each competitors's victory
		//pick random number
		//declare a competitor the winner
		//increment their stats
		//push them into finishedArr



		//we need a ref
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

