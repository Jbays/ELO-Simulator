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
		recordResult(competitionMats,[pointsAtStake[0][0],pointsAtStake[1][1]],["w","l"])
	} else {//rightSide won!
		//pointsAtStake[pointsForLoss,pointsForVictory]
		recordResult(competitionMats,[pointsAtStake[0][1],pointsAtStake[1][0]],["l","w"])
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
function recordResult(competitionMats,pointsAwarded,matchOutcomeArr){
	competitionMats.forEach(function(competitor,index){
		let matchOutcome = matchOutcomeArr[index];

		//NOTE: For technical reasons, toggle compRecord first!
		//NOTE: Looks like the compRecord is not being written as I would want.
		//NOTE: compRecord should be "***competitorsRating-opponentName-opponentRating***"
		//^^BEFORE the match outcome was determined!
		
		//if index is 0, opponent's name is at index 1
		//if index is 1, opponent's name is at index 0
		competitor.compRecord = competitor.compRecord +"***"+ ((index === 0) ?
			competitor.rating+"-"+competitionMats[1].name+"-"+competitionMats[1].rating :
			competitor.rating+"-"+competitionMats[0].name+"-"+competitionMats[0].rating);

		competitor.rating = competitor.rating + pointsAwarded[index];

		if ( matchOutcome === 'w' ) {
			competitor.wins += 1;
		} else if ( matchOutcome === 'l' ) {
			competitor.losses += 1;
		}


		//the ternary assignment prevents undefined values from being added to streak
		competitor.streak = (competitor.streak ? competitor.streak: "") + matchOutcomeArr[index]
	});

	return competitionMats
}

/**
 * @name: writeToTheirRecord
 * @description: Toggles the competitor's record equal to their match result
 * @param1: recordString
 * @param2: letterResultStr
 * @returns: newlyToggledRecord
 **/
function writeToTheirRecord(yourRating,recordString,opponentsRating){
	// let splitRecord = recordString.split('-')
	//
	// if ( letterResultStr === "w" ) {
	// 	splitRecord[0] = parseInt(splitRecord[0])+1
	// } else {//letterResultArr === "l"
	// 	splitRecord[1] = parseInt(splitRecord[1])+1
	// }
	//
	// return splitRecord.join('-')
}

module.exports = decideTheWinner;
