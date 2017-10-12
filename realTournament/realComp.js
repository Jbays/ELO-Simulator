const allCompetitors = require('./parseCsv.js');
const runCompetitionMats = require('../index.js');
const _ = require('underscore');

let shuffledCompetitors = _.shuffle(allCompetitors);

//these two lines will create n number of competitors
//then shuffle the competitors into the real competitor data
let artificialCompetitors = makeDummyCompetitors(32);
shuffledCompetitors = _.shuffle(shuffledCompetitors.concat(artificialCompetitors));

/**
 * @name: makeDummyCompetitors
 * @description: creates "n" number of competitors
 * @param: numOfCompetitors (integer) - the amount of competitors to be generated
 * @returns: all competitors in a shuffled array
 **/
function makeDummyCompetitors(numOfCompetitors){
	let outputArr = [];

	//for-loop which will generate competitors equaling to numOfCompetitors
	for (let i=0;i<numOfCompetitors;i++){
    let competitorBlueprint = '{"name":"'+'c'+(i+1).toString()+'","teamName":"generic","bracket":"n/a","rating":1600,"wins":0,"losses":0,"streak":"","compRecord":""}';

    outputArr.push(JSON.parse(competitorBlueprint))
	}

	return _.shuffle(outputArr)
}


//where runCompetitionMats(numberOfRounds,competitors,kFactor,classSize)
//Param1: numberOfRounds is the number of rounds each competitor will compete!
//Param2: shuffledCompetitors are the competitor objects to compete!
//Param3: kFactor is the amount of points to be waged PER MATCH.
//Param4: classSize determines the amount of points difference
//NOTE:   Probability of victory/loss for rating difference of one classSize
//NOTE:   Rating separation of ONE-HALF class
//NOTE:   64%/36% WHERE 64% prob of victory belongs to the higher-rated player.
//NOTE:   64%/36% WHERE 36% prob of victory belongs to the lower-rated player.
//NOTE:   Rating separation of ONE class
//NOTE:   76%/24% WHERE 76% prob of victory belongs to the higher-rated player.
//NOTE:   76%/24% WHERE 24% prob of victory belongs to the lower-rated player.
//NOTE:   Rating separation of THREE-HALF classes
//NOTE:   85%/15% WHERE 85% prob of victory belongs to the higher-rated player.
//NOTE:   85%/15% WHERE 15% prob of victory belongs to the lower-rated player.
//NOTE:   Rating separation of TWO classes
//NOTE:   91%/9% WHERE 91% prob of victory belongs to the higher-rated player.
//NOTE:   91%/9% WHERE 9% prob of victory belongs to the lower-rated player.
console.log(runCompetitionMats(30,shuffledCompetitors,64,200));

// ** Note, that FIDE changed the K-factors as of July 2014 (see FIDE rating regulations - chapter 8.56):
// K = 40 for a player new to the rating list until he has completed events with at least 30 games
// K = 20 as long as a player's rating remains under 2400.
// K = 10 once player's rating reached 2400.
// K = 40 for all players until their 18th birthday, as long as their rating remains under 2300.
//NOTE: 2400 converts to black belt.  GUESS?!
