const allCompetitors = require('./parseCsv.js');
const runCompetitionMats = require('../index.js');
const _ = require('underscore');

let shuffledCompetitors = _.shuffle(allCompetitors);

console.log("shuffledCompetitors.length>>>",shuffledCompetitors.length);



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
// console.log(runCompetitionMats(10,shuffledCompetitors,64,200));

// ** Note, that FIDE changed the K-factors as of July 2014 (see FIDE rating regulations - chapter 8.56):
// K = 40 for a player new to the rating list until he has completed events with at least 30 games
// K = 20 as long as a player's rating remains under 2400.
// K = 10 once player's rating reached 2400.
// K = 40 for all players until their 18th birthday, as long as their rating remains under 2300.
//NOTE: 2400 converts to black belt.  GUESS?!
