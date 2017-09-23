const allCompetitors = require('../parseCsv.js');
const runCompetitionMats = require('../index.js');
const _ = require('underscore');

let shuffledCompetitors = _.shuffle(allCompetitors);

console.log(runCompetitionMats(10,shuffledCompetitors,32,200));

//shuffle competitors
//match competitors
//make them compete
//update their stats (based on results of their match)
//shuffle competitors
//match competitors
