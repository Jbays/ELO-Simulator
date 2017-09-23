'use strict';

//NOTE:THIS IS FOR A REAL COMPETITION.
//NOTE:MAKING NECESSARY CHANGES TO GET THIS CODE TO WORK WITH REAL COMPETITORS
//NOTE:ORIGINAL IS runCompMats.js

/**
 * @name: decideTheWinner
 * @description: Triggers competition.
 **							(1) A winner is declared
 **							(2) Stats for both competitors are toggled
 * @param1: comeptitionMats
 * @param2: victoryProbabilities
 * @param3: pointsAtStake
 * @returns: allCompetitors
 **/
function decideTheWinner (competitionMats,victoryProbabilities,pointsAtStake){
	//decide winner && record result
	let randomNumber = Math.random();

	//leftSide won!
	if (victoryProbabilities[0]>randomNumber) {
		//pointsAtStake[pointsForVictory,pointsForLoss]
		recordResult(competitionMats,[pointsAtStake[0][0],pointsAtStake[1][1]],["w","l"],victoryProbabilities)
	} else {//rightSide won!
		//pointsAtStake[pointsForLoss,pointsForVictory]
		recordResult(competitionMats,[pointsAtStake[0][1],pointsAtStake[1][0]],["l","w"],victoryProbabilities)
	}

	return competitionMats
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
function recordResult(competitionMats,pointsAwarded,matchOutcomeArr,victoryProbabilities){

	//NOTE: For technical reasons, toggle compRecord first!
	competitionMats = competitionMats.map((competitor,index)=>{
		//if index is zero, then opponent is to @ index 1.
		let opponent = index === 0 ? competitionMats[1] : competitionMats[0];
		//calculate chance of victory for competitor
		let chanceOfVictory = Number((victoryProbabilities[index])*100).toFixed(2);

		competitor.compRecord = competitor.compRecord+"***"+chanceOfVictory+"W%---"+
			competitor.rating+"-"+opponent.name+"-"+opponent.rating;

		return competitor;
	})


	competitionMats.forEach(function(competitor,index){
		let matchOutcome = matchOutcomeArr[index];

		if ( matchOutcome === 'w' ) {
			competitor.wins += 1;
		} else if ( matchOutcome === 'l' ) {
			competitor.losses += 1;
		}

		//the ternary assignment prevents undefined values from being added to streak
		competitor.streak = (competitor.streak ? competitor.streak: "") + matchOutcomeArr[index]
		competitor.rating += pointsAwarded[index];
	});

	return competitionMats
}

module.exports = decideTheWinner;
