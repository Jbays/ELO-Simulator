'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]
var numberOfRounds = null;

var bullPen            = [];
var theCompetitionMats = [];
var winnersBracket     = [];
var losersBracket      = [];
var firstCompetitorsProbabilityOfVictory  = 0;
var secondCompetitorsProbabilityOfVictory = 0;

var firstCompetitor       = null;
var firstCompetitorLosses = 0;
var firstCompetitorName   = null;
var firstCompetitorRating = null;
var firstCompetitorRecord = null;
var firstCompetitorWins   = 0;

var secondCompetitor       = null;
var secondCompetitorName   = null;
var secondCompetitorWins   = 0;
var secondCompetitorLosses = 0;
var secondCompetitorRating = null;
var secondCompetitorRecord = null;

var ifFirstCompetitorWins   = null;
var ifFirstCompetitorLoses  = null;
var ifSecondCompetitorWins  = null;
var ifSecondCompetitorLoses = null;


/**
 * @name - bullPenGenerator
 * @description - outputs bullPen populated with integer^2 number of competitors
 * @example - bullPen = [{c1},{c2},{c3},...,{c(integer^2)}]
 *            bullPen.length = integer^2
 * @param - integer
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
};

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

  //important to save this step for last
  //otherwise secondCompetitorsRating may not be defined
  //at assignment-time for firstCompetitorsProbabilityOfVictory
  firstCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)));
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)));
};

/**
 * @name - referee
 * @description - Pulls a random number between 0 and 1
 *                ** matchRecorder -- Writes match as a string on competitor's record
 *                If firstCompetitorsProbabilityOfVictory is greater than randomNumber
 *                  Assigns victory to firstCompetitor
 *                else
 *                  Assigns victory to secondCompetitor
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
 * @example - 'matches': {'1600-c733-1600***1588-c503-1613'}
 *             where at time of match: '1600' is competitorObject's rating
 *                                     'c733' is competitorObject's opponent
 *                                     '1600' is competitorObject's opponent's rating
 *             '***' delimiter
 *             Second match:           '1588' is competitorObject's rating
 *                                     'c503' is competitorObject's opponent
 *                                     '1613' is competitorObject's opponent's rating
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
 * @description - Determines the result of firstCompetitor's match
 *                ** ratingsAtStakeCalculator(k) -- calculates the ratings at stake for each player
 *                                                  depending on whether they win or lose
 *                Adds additional ratings points to winner
 *                Subtracts rating points from loser
 * @param - theCompetitionMats
 * @param - k-factor
 **/
var ratingsAdjuster = function(array,k) {
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
 *                stands to win or lose based on the result of the match.
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
 * @description - Checks last entry of firstCompetitorRecord
 *                Then places winner of match into innersBracket
 *                And loser of match into losersBracket
 * @param - firstCompetitorRecord
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
 * @name - runAllMatchesForOneRound
 * @description - Makes all competitorObjects in bullPen compete once
 *                **competitorMatPopulator     -- Puts two competitorObjects into theCompetitionMats
 *                **variableAssigner           -- Gives values to all variables required for ELO-calculation
 *                **referee                    -- Declares winner and loser in theCompetitionMats
 *                **ratingsAdjuster            -- Adjusts both winner's and loser's rating
 *                **competitionMatsDepopulator -- Empties theCompetitionMats
 * @param - bullPen
 * @param - k-factor
 **/
var runAllMatchesForOneRound = function(array,k){
  let numberOfMatches = array.length/2
  for ( let i = 0; i < numberOfMatches; i++ ){
    competitionMatPopulator(array);
    variableAssigner(theCompetitionMats);
    referee(firstCompetitorsProbabilityOfVictory);
    ratingsAdjuster(theCompetitionMats,k);
    competitionMatDepopulator(firstCompetitorRecord,theCompetitionMats);
  }
  bullPen = winnersBracket;
  winnersBracket = [];
};

/**
 * @name - roundsCalculator
 * @description - Makes all competitorObjects in bullPen compete once
 *                **calculateNumberOfRounds -- calculates the number of rounds 1st and 2nd will fight!
 * @param - integer
 **/

var roundsCalculator = function(integer){
  let oNSquared = integer*integer;
  var calculateNumberOfRounds = function(integer){
    let competitorsHalved = integer/2;
    numberOfRounds++;
    if ( competitorsHalved !== 1 ) {
      calculateNumberOfRounds(competitorsHalved);
    } else {
      console.log("The winner will fight",numberOfRounds,"times!");
    }
  };
  calculateNumberOfRounds(oNSquared);
};

/**
 * @name - singleEliminationTournament
 * @description - Makes all competitorObjects in bullPen compete once
 *                **bullPenGenerator -- builds competitors; populates bullPen
 *                **roundsCalculator -- calculates the number of rounds 1st and 2nd will fight!
 *                Invokes runAllMatchesForOneRound() for numberOfRounds
 * @param - integer
 * @param - k-factor
 **/
var singleEliminationTournament = function(integer,k){
  bullPenGenerator(integer);
  console.log("bullPen had",bullPen.length,"number of competitors!")
  roundsCalculator(integer);
  for ( let i = 1; i <= numberOfRounds; i++ ) {
    runAllMatchesForOneRound(bullPen,k);
  }
  // console.log("losersBracket:",losersBracket);
  console.log("TOURNAMENT'S WINNER!",bullPen[0]);
  console.log("winnersBracket.length:",winnersBracket.length);
  console.log("losersBracket.length:",losersBracket.length);
};

// Will generate n^2 competitors which will
// Compete in a single-elimination tournament
// Until a winner is declared.
// k is the maximal number of points a player can win/lose in a given match
singleEliminationTournament(256,25);

