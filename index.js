// 'use strict';
//
// const _ = require('underscore');
// const decideTheWinner = require('./realTournament/recordRealResults.js');;
//
// /**
//  * @name: generateCompetitors
//  * @description: creates "n" number of competitors
//  * @param: numOfCompetitors (integer) - the total amount of competitors in a tournament
//  * @returns: allCompetitors
//  **/
// function generateCompetitors(numOfCompetitors){
// 	let outputArr = [];
//
// 	//for-loop which will generate competitors equaling to numOfCompetitors
// 	for (let i=0;i<numOfCompetitors;i++){
//     let competitorBlueprint = '{"c'+(i+1).toString()+'":{"rating":1600,"record":"0-0","streak":""}}';
//
//     outputArr.push(JSON.parse(competitorBlueprint))
// 	}
//
// 	//10:35am - what to do about competitors's belts??
//
// 	return _.shuffle(outputArr)
// }
//
// /**
//  * @name: calculateProbabilityOfVictory
//  * @description: calculates the probability of victory for each competitor,
//  **							 then returns those probabilities in an array
//  * @param1: competitionMats
//  * @returns: [probabilityOfVictoryForLeft,probabilityOfVictoryForRight]
//  **/
// function calculateProbabilityOfVictory(competitionMats,classSize){
// 	let leftSideComp  = competitionMats[0]
// 	let rightSideComp = competitionMats[1]
//
// 	return [(1/(1+Math.pow(10,((rightSideComp.rating- leftSideComp.rating)/(2*classSize))))),
// 					(1/(1+Math.pow(10,(( leftSideComp.rating-rightSideComp.rating)/(2*classSize)))))]
// }
//
// /**
//  * @name: calculatePointsAtStake
//  * @description: Calculates the amount of points each competitor should:
//  **							 (1) Gain in victory
//  **							 (2) Lose in defeat
//  * @param1: victoryProbTuple
//  * @param2: kFactor
//  * @returns: [pointsGainedInVictory,pointsLostInDefeat]
//  **/
// function calculatePointsAtStake(victoryProbTuple,kFactor){
// 	let outputArr = []
//
// 	//for each competitor's victoryProbability
// 	victoryProbTuple.forEach(function(victoryProbability){
//
// 		let correctStakes = [(1-victoryProbability),-victoryProbability].map(function(outcomeProbability){
// 			//NOTE: dividing points at stake by 2.  Needs to be rounded.
// 			return Math.round((parseInt((kFactor*outcomeProbability).toFixed())/2))
// 			//NOTE: this is the original --> just in case
// 			// return (parseInt((kFactor*outcomeProbability).toFixed())/2)
// 		})
//
// 		outputArr.push(correctStakes);
// 	})
//
// 	return outputArr
// }
//
// /**
//  * @name: runTournament
//  * @description: Applies ELO rating system to a brazilian jiu-jitsu tournament
//  * @param0: numOfRounds (integer) - the amount of tournament rounds for each bjj competitor
//  * @param1: numOfCompetitors (integer) - the amount of bjj competitors
//  * @param2: kFactor (integer) - the MOST amount of points a competitor can win or loser.
//  * @param3: classSize (integer) - the amount of bjj competitors
//  * @returns: all competitors after competition
//  **/
// function runTournament(numOfRounds,numOfCompetitors,kFactor,classSize){
// 	console.log("running a tournament of !!!",numOfRounds,"rounds !!!")
// 	console.log("and                     !!!",numOfCompetitors,"competitors !!!")
// 	let allCompetitorsArr = generateCompetitors(numOfCompetitors);
//
// 	//tuplizes first half with second half of allCompetitorsArr
// 	let tuplizeCompetitors = _.zip(allCompetitorsArr.slice(0,(allCompetitorsArr.length/2)),
// 														allCompetitorsArr.slice((allCompetitorsArr.length/2),allCompetitorsArr.length));
//
// 	//This runs one round of competition for rounds = numOfRounds
// 	for (let i=1;i<numOfRounds+1;i++) {
// 		tuplizeCompetitors.forEach(function(competitionMats){
//
// 			//calculate probability of victory for each competitor
// 			let victoryProbTuple  = calculateProbabilityOfVictory(competitionMats,classSize);
// 			//calculate the points at stake for each competitor
// 			let pointsStakesTuple = calculatePointsAtStake(victoryProbTuple,kFactor);
//
// 			//NOTE: low likelihood of victory means few points lost & many points gained
// 			//high likelihood of victory means many points lost & few points gained
//
// 			runCompetitionMats(competitionMats,victoryProbTuple,pointsStakesTuple)
// 		})
// 	}
//
// 	//numOfCompetitors competitors AFTER numOfRounds-round tournament
// 	return allCompetitorsArr
// }
//
// //NOTE: 5-13-2017
// //the 2015 Mundials had 1861 competitors
// //whose proportions between belts were:
// //if 25 competitors --> = [2,4,7,9,3];
// //WHERE index=0 is black belts
// //index=1 is brown belts
// //...
// //index=4 is white belts
//
// // 4-round 16-person tournament
// // console.log("These are the results of the tournament",runTournament(4,16,32,200));
//
// // The system is functional IF an 11-round tournament runs with 2048 competitors WITHOUT ERROR
// // console.log("These are the results of the tournament",runTournament(11,2048,32,200));
//
// /**
//  * @name: runTournament2
//  * @description: Applies ELO rating system to a brazilian jiu-jitsu tournament
//  * NOTE: THIS IS THE DUP!
//  * @returns: all competitors after competition
//  **/
//
// function runTournament2(numOfRounds,allCompetitors,kFactor,classSize){
// 	console.log("running a tournament of !!!",numOfRounds,"rounds !!!")
// 	console.log("and                     !!!",allCompetitors.length,"competitors !!!")
//
// 	//This runs one round of competition for rounds = numOfRounds
// 	for (let i=1;i<numOfRounds+1;i++) {
// 		//shuffle competitors every time before competition!
// 		allCompetitors = _.shuffle(allCompetitors);
//
// 		//tuplizes first half with second half of allCompetitorsArr
// 		let tuplizeCompetitors = _.zip(allCompetitors.slice(0,(allCompetitors.length/2)),
// 			allCompetitors.slice((allCompetitors.length/2),allCompetitors.length));
//
// 		tuplizeCompetitors.forEach(function(competitionMats){
// 			//calculate probability of victory for each competitor
// 			let victoryProbTuple  = calculateProbabilityOfVictory(competitionMats,classSize);
// 			//calculate the points at stake for each competitor
// 			let pointsStakesTuple = calculatePointsAtStake(victoryProbTuple,kFactor);
//
// 			//NOTE: low likelihood of victory means few points lost & many points gained
// 			//high likelihood of victory means many points lost & few points gained
// 			decideTheWinner(competitionMats,victoryProbTuple,pointsStakesTuple);
// 		})
// 	}
//
// 	//allCompetitors competitors AFTER numOfRounds-round tournament
// 	return allCompetitors
// }
//
// module.exports = {
// 	calculateProbabilityOfVictory:calculateProbabilityOfVictory,
// 	calculatePointsAtStake:calculatePointsAtStake,
// 	runTournament2:runTournament2
// };
