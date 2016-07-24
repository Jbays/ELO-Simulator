/**
 * Created by justin.baize on 6/16/16.
 */

'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]
var bullPen            = []
var theCompetitionMats  = []
var winnersBracket     = []
var losersBracket      = []
var firstCompetitorsProbabilityOfVictory  = 0
var secondCompetitorsProbabilityOfVictory = 0

var firstCompetitor        = null
var secondCompetitor       = null
var nameOfFirstCompetitor  = null
var nameOfSecondCompetitor = null
var firstCompetitorRating  = null
var secondCompetitorRating = null
var recordWinsForFirstCompetitor    = 0
var recordWinsForSecondCompetitor   = 0
var recordLossesForFirstCompetitor  = 0
var recordLossesForSecondCompetitor = 0

var firstCompetitorName    = null;
var firstCompetitorWins    = 0;
var firstCompetitorLosses  = 0;
var firstCompetitorRecord  = null;
var ifFirstCompetitorWins  = null;
var ifFirstCompetitorLoses = null;

var secondCompetitorName    = null;
var secondCompetitorWins    = 0;
var secondCompetitorLosses  = 0;
var secondCompetitorRecord  = null;
var ifSecondCompetitorWins  = null;
var ifSecondCompetitorLoses = null;

//k is the maximal number of points a player can win/lose in a given match
var k = 8

/**
 * @name bullPenGenerator
 * @description - takes an integer as input
 *                outputs number of competitors === integer^2
 *                in form bullPen = [{c1},{c2},{c3}]
 * @param numberOfRequiredRounds
 **/

var bullPenGenerator = function(integer) {
  var nSquared = integer*integer;
  var competitorAssembler = function (nSquared) {
    for (let i = 1; i <= nSquared; i++) {
      let yourNumber = i.toString();
      let competitorBlueprint = '{"c' + yourNumber + '":{"rating":1600,"wins":0,"losses":0,"record":"","matches":""}}';

      bullPen.push(JSON.parse(competitorBlueprint));
    }
  };
  competitorAssembler(nSquared);
};


/**
 * @name - competitionMatPopulator
 * @description - Takes as input bullPen array
 *                Removes first and second competitors from bullPen
 *                And places them inside theCompetitionMats
 * @param - bullPen
 *
 **/
var competitionMatPopulator = function(array){
  theCompetitionMats.push(array.shift())
  theCompetitionMats.push(array.shift())
}

/**
 * @name - variableAssigner
 * @description - Assigns to variables all statistics relevant to calculations for
 *                the two competitors on theCompetitionMats.
 * @param - theCompetitionMats
 **/
var variableAssigner = function(array){
  firstCompetitor       = array[0];
  firstCompetitorName   = Object.keys(firstCompetitor)[0];
  firstCompetitorRating = firstCompetitor[firstCompetitorName]['rating'];
  firstCompetitorWins   = firstCompetitor[firstCompetitorName]['wins'];
  firstCompetitorLosses = firstCompetitor[firstCompetitorName]['losses'];
  firstCompetitorRecord = firstCompetitor[firstCompetitorName]['record'];

  secondCompetitor       = array[1];
  secondCompetitorName   = Object.keys(secondCompetitor)[0];
  secondCompetitorRating = secondCompetitor[secondCompetitorName]['rating'];
  secondCompetitorWins   = secondCompetitor[secondCompetitorName]['wins'];
  secondCompetitorLosses = secondCompetitor[secondCompetitorName]['losses'];
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record'];

  firstCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)));
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)));
};

/**
 * @name - referee
 * @description - Pulls a random draw (between 0-1) and assigns a victory based
 *                on firstCompetitorsProbabilityOfVictory
 * @param - theCompetitorMats
 * @param - firstCompetitorsProbabilityOfVictory
 **/
var referee = function(probability){
  let randomNumber = Math.random();
  matchRecorder();

  if ( probability > randomNumber ) {
    firstCompetitor[firstCompetitorName]['wins']++;
    firstCompetitor[firstCompetitorName]['record'] = firstCompetitorRecord + "w";

    secondCompetitor[secondCompetitorName]['losses']++;
    secondCompetitor[secondCompetitorName]['record'] = secondCompetitorRecord + "l";
  } else {
    firstCompetitor[firstCompetitorName]['losses']++;
    firstCompetitor[firstCompetitorName]['record'] = firstCompetitorRecord + "l";

    secondCompetitor[secondCompetitorName]['wins']++;
    secondCompetitor[secondCompetitorName]['record'] = secondCompetitorRecord + "w";
  }
};

/**
 * @name - matchRecorder
 * @description - To 'matches' key in competitorObject, assigns value -->
 *                stringified record of match just finished in theCompetitionMats.
 *                Each match is delimited by '***'
 *                EX: 'matches': {'1600-c733-1600***1588-c503-1613'}
 *                  where at time of match: '1600' is competitorObject's rating
 *                                          'c733' is competitorObject's opponent
 *                                          '1600' is competitorObject's opponent's rating
 *                  '***' delimiter
 *                  Second match:           '1588' is competitorObject's rating
 *                                          'c503' is competitorObject's opponent
 *                                          '1613' is competitorObject's opponent's rating
 * @param - none
 **/
var matchRecorder = function(){
  firstCompetitor[firstCompetitorName]['matches'] = firstCompetitor[firstCompetitorName]['matches']
                                                  + firstCompetitorRating.toString()
                                                  + "-" + secondCompetitorName
                                                  + "-" + secondCompetitorRating.toString() + "***";

  secondCompetitor[secondCompetitorName]['matches'] = secondCompetitor[secondCompetitorName]['matches']
                                                    + secondCompetitorRating.toString()
                                                    + "-" + firstCompetitorName
                                                    + "-" + firstCompetitorRating.toString() + "***";
};

/**
 * @name - ratingsAdjuster
 * @description - Calculates the raw new ratings for the competitors after
 *                the results of their match has been tabulated.
 *                Rounds raw rating, then assigns new rating to competitor
 **/
var ratingsAdjuster = function(array) {
  let firstCompetitorLastMatchResult = array[0][firstCompetitorName]['record'].slice(array[0][firstCompetitorName]['record'].length-1);
  ratingsAtStakeCalculator(k);

  if ( firstCompetitorLastMatchResult === 'w' ) {
    firstCompetitor[firstCompetitorName]['rating']   = Math.round(firstCompetitorRating + ifFirstCompetitorWins);
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorLoses);

  } else {
    firstCompetitor[firstCompetitorName]['rating'] = Math.round(firstCompetitorRating + ifFirstCompetitorLoses);
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorWins);
  }
  firstCompetitorRecord = firstCompetitor[firstCompetitorName]['record'];
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record'];
};

/**
 * @name - ratingsAtStakeCalculator
 * @description - Calculates how much each competitorObject in theCompetitionMats
 *                stands to win or lose in their match.
 * @param - k-factor
 **/
var ratingsAtStakeCalculator = function(k){
  ifFirstCompetitorWins   = k*(1-firstCompetitorsProbabilityOfVictory);
  ifFirstCompetitorLoses  = k*(-firstCompetitorsProbabilityOfVictory);
  ifSecondCompetitorWins  = k*(1-secondCompetitorsProbabilityOfVictory);
  ifSecondCompetitorLoses = k*(-secondCompetitorsProbabilityOfVictory);
};

/**
 * @name - competitionMatDepopulator
 * @description - Takes as input bullPen array
 *                Removes both competitors from theCompetitionMats
 *                Places winner of match into Winners Bracket
 *                And loser of match into Losers Bracket
 * @param - theCompetitionMats
 **/
var competitionMatDepopulator = function(string,array){
  if ( string.charAt(string.length-1) === 'l' ) {
    winnersBracket.push(array.pop());
    losersBracket.push(array.pop());
  } else {
    losersBracket.push(array.pop());
    winnersBracket.push(array.pop());
  }
};

/**
 * @name - runOneTournamentRound
 * @description - Takes as input bullPen array
 *                Makes all competitorObjects in bullPen compete once
 *                **competitorMatPopulator     -- Puts two competitorObjects into theCompetitionMats
 *                **variableAssigner           -- Gives values to all variables required for ELO-calculation
 *                **referee                    -- Declares winner and loser in theCompetitionMats
 *                **ratingsAdjuster            -- Adjusts both winner's and loser's rating
 *                **competitionMatsDepopulator -- Empties theCompetitionMats
 * @param - bullPen
 **/
var runAllRounds = function(array){
  let requiredIterations = array.length/2
  for ( let i = 0; i < requiredIterations; i++ ){
    competitionMatPopulator(array);
    variableAssigner(theCompetitionMats);
    referee(firstCompetitorsProbabilityOfVictory);
    ratingsAdjuster(theCompetitionMats);
    competitionMatDepopulator(firstCompetitorRecord,theCompetitionMats);
  }
  bullPen = winnersBracket;
  winnersBracket = [];
};

var singleEliminationTournament = function(integer){
  bullPenGenerator(integer);
  for ( let i = 1; i <= integer; i++ ) {
    runAllRounds(bullPen);
  }

  console.log("TOURNAMENT'S WINNER!",bullPen[0]);
  console.log("losersBracket:",losersBracket.reverse());

  console.log("winnersBracket.length:",winnersBracket.length);
  console.log("losersBracket.length:",losersBracket.length);


}


// Will generate n^2 competitors which will
// Compete in a single-elimination tournament
// Until a winner is declared.


singleEliminationTournament(4);

