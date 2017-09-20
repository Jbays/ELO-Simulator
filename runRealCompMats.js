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
	// console.log("competitionMats",competitionMats)
	// console.log("pointsAwarded",pointsAwarded)
	// console.log("matchOutcomeArr",matchOutcomeArr)

	competitionMats.forEach(function(competitor,index){
		// console.log("this is competitor>>>",competitor);
		let competitorNameStr = Object.keys(competitor);
		// console.log("this is competitorNameStr>>>",competitorNameStr);

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

module.exports = decideTheWinner;
