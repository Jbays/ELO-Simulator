'use strict';

const _ = require('underscore');

/**
 * @name: generateCompetitors
 * @description: creates "n" number of com
 * @param: numOfCompetitors (integer) - the total amount of competitors in a tournament
 * @returns: allCompetitors
 **/
function generateCompetitors(numOfCompetitors){
	let outputArr = [];

	for (let i=0; i<numOfCompetitors ;i++ ){
    let competitorBlueprint = '{"c' + i.toString() + '":{"rating":1600,"wins":0,"losses":0,"compHistory":"","record":""}}';

    outputArr.push(JSON.parse(competitorBlueprint))
	}
	return outputArr
}

/**
 * @name: makeCompetitorsCompete
 * @description: 
 * @param: 
 * @returns:
 **/
function makeCompetitorsCompete(numberOfRounds,everySingleCompetitorArr){
	console.log("numberOfRounds>>>>",numberOfRounds);
	console.log("everySingleCompetitorArr>>>>",everySingleCompetitorArr);

	//what needs to happen to make two competitors compete?

	//we need to isolate two competitors from the bullPen (aka everySingleCompetitorArr)
	


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

	const allCompetitors = generateCompetitors(tournSize)

	makeCompetitorsCompete(roundNum,generateCompetitors(tournSize))


	// console.log("these are our competitors>>>>",allCompetitors)

	//creator competitors

	//make them compete

	//afterward I'll have some interesting choices:

	//Choices:
	//1. save competitors to db then run competition again

	//2. or make basic ui?

	


	// return ...what?

}

//the simplest tournament is two rounds, four competitors
runTournament(2,4)

