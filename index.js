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
 * @name: makeAllCompete
 * @description: 
 * @param: 
 * @returns:
 **/
function makeAllCompete(numberOfRounds,everySingleCompetitorArr){
	console.log("numberOfRounds>>>>",numberOfRounds);
	console.log("everySingleCompetitorArr>>>>",everySingleCompetitorArr);

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
		compMats.push(everySingleCompetitorArr.pop(),everySingleCompetitorArr.pop())

		console.log("compMats",compMats)

		finishedArr.push(compMats.pop(),compMats.pop())
	}

	console.log("these competitors finished competing",finishedArr)






	//what needs to happen to make two competitors compete?

	//make competitors compete 
	

	//we need to isolate two competitors from the bullPen (aka everySingleCompetitorArr)

	//we need a ref
	//we need a scorekeeper
	//we need competition mats





}


/**
 * @name: runTournament
 * @description: Calculates the elo rating of bjj competitors after a tournament
 * @param: roundNum (integer) - the amount of tournament rounds for each bjj competitor
 * @param: tournSize (integer) - the amount of bjj competitors
 * @returns: results of tournament
 **/
function runTournament(roundNum,tournSize){
	console.log("running a tournament of !!!",roundNum,"rounds !!!")
	console.log("and                     !!!",tournSize,"competitors !!!")

	//this line will create all competitorObjs
	//and put them in an array
	//generateCompetitors(tournSize)

	//make them compete
	makeAllCompete(roundNum,generateCompetitors(tournSize))


	//afterward I'll have some interesting choices:

	//Choices:
	//1. save competitors to db then run competition again

	//2. or make basic ui?



	// return ...what?
}

//the simplest tournament is two rounds, four competitors
runTournament(2,4)

