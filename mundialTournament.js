'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]
var numberOfRounds = null;

var demographicInformation = [144,306,551,642,198];
var jiujitsuBelts = ['black','brown','purple','blue','white'];

var bullPen             = [];
var bullPenLength       = null;
var theCompetitionMats  = [];
var aboutToCompeteArray = []
var winnersBracket      = [];
var losersBracket       = [];
var nSquared            = null;
var firstCompetitorsProbabilityOfVictory  = 0;
var secondCompetitorsProbabilityOfVictory = 0;

var firstCompetitor       = null;
var firstCompetitorLosses = 0;
var firstCompetitorName   = null;
var firstCompetitorRating = null;
var firstCompetitorRecord = null;
var firstCompetitorWins   = 0;
var firstCompetitorBelt   = null;
var firstCompetitorBeltRank = null;

var secondCompetitor       = null;
var secondCompetitorName   = null;
var secondCompetitorWins   = 0;
var secondCompetitorLosses = 0;
var secondCompetitorRating = null;
var secondCompetitorRecord = null;
var secondCompetitorBelt   = null;
var secondCompetitorBeltRank = null;

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

var bullPenGenerator = function(demographicInformation) {
  let counter = 1;
  var competitorAssembler = function(demographicInformation){
    //go across each item in demographicInformation array
    for ( let j = 0; j < demographicInformation.length; j++ ) {
      //for as many as are in each of demographicInformation's elements
      for ( let i = 1; i <= demographicInformation[j]; i++ ) {
        let competitorNameBlueprint = counter.toString();
        let competitorBlueprint = '{"c' + competitorNameBlueprint
              + '":{"rating":1600,"wins":0,"losses":0,"record":"","beltRank":'
              + j  + ',"belt":"' + jiujitsuBelts[j] + '","matches":""}}';
        counter++;

        bullPen.push(JSON.parse(competitorBlueprint));
      }
    }
  };
  competitorAssembler(demographicInformation);
};

var separateBelts = function(demographicInformation,bullPen){
  let leadingBelt      = Object.keys(bullPen[0]);
  // let leadingBeltColor = bullPen[0][leadingBelt]['belt']
  let numberOfBelts = demographicInformation.shift();

  for ( let i = 0; i < numberOfBelts; i++ ) {
    aboutToCompeteArray.push(bullPen.shift());
  }

  bullPenLength = bullPen.length;
  // console.log("inside separateBelts --> bullPen.length:",bullPen.length);
  // console.log("separateBelts invoked!");
  // console.log("leadingBelt:",leadingBelt);
  // console.log("leadingBeltColor:",leadingBeltColor);
}

/**
 * @name - competitionMatPopulator
 * @description - Takes as input bullPen array
 *                Removes first and second competitors from bullPen
 *                And places them inside theCompetitionMats
 * @param - bullPen
 *
 **/
var competitionMatPopulator = function(aboutToCompeteArray, bullPen){
  theCompetitionMats.push(aboutToCompeteArray.shift())
  theCompetitionMats.push(bullPen.pop())
};


/**
 * @name - variableAssigner
 * @description - Assigns to variables all statistics relevant to calculations for
 *                the two competitors on theCompetitionMats.
 * @param - theCompetitionMats
 **/
var scribe = function(theCompetitionMats){
  firstCompetitor       = theCompetitionMats[0];
  firstCompetitorName   = Object.keys(firstCompetitor)[0];
  firstCompetitorRating = firstCompetitor[firstCompetitorName]['rating'];
  firstCompetitorWins   = firstCompetitor[firstCompetitorName]['wins'];
  firstCompetitorLosses = firstCompetitor[firstCompetitorName]['losses'];
  firstCompetitorRecord = firstCompetitor[firstCompetitorName]['record'];
  firstCompetitorBelt   = firstCompetitor[firstCompetitorName]['belt'];
  firstCompetitorBeltRank = firstCompetitor[firstCompetitorName]['beltRank'];

  secondCompetitor       = theCompetitionMats[1];
  secondCompetitorName   = Object.keys(secondCompetitor)[0];
  secondCompetitorRating = secondCompetitor[secondCompetitorName]['rating'];
  secondCompetitorWins   = secondCompetitor[secondCompetitorName]['wins'];
  secondCompetitorLosses = secondCompetitor[secondCompetitorName]['losses'];
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record'];
  secondCompetitorBelt   = secondCompetitor[secondCompetitorName]['belt'];
  secondCompetitorBeltRank = secondCompetitor[secondCompetitorName]['beltRank'];

  //important to save this step for last
  //otherwise secondCompetitorsRating may not be defined
  //at assignment-time for firstCompetitorsProbabilityOfVictory
  firstCompetitorsProbabilityOfVictory  = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)));
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)));
};

//should compare against numerical representation of belt
var referee = function(firstCompetitorBeltRank,secondCompetitorBeltRank){
  matchRecorder();

  if ( firstCompetitorBeltRank < secondCompetitorBeltRank ) {
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
 * @name - ratingsAdjuster
 * @description - Determines the result of firstCompetitor's match
 *                ** ratingsAtStakeCalculator(k) -- calculates the ratings at stake for each player
 *                                                  depending on whether they win or lose
 *                Adds additional ratings points to winner
 *                Subtracts rating points from loser
 * @param - theCompetitionMats
 * @param - k-factor
 **/
var ratingsAdjuster = function(theCompetitionMats,k) {
  let firstCompetitorLastMatchResult = theCompetitionMats[0][firstCompetitorName]['record'].slice(theCompetitionMats[0][firstCompetitorName]['record'].length-1);
  ratingsAtStakeCalculator(k);

  if ( firstCompetitorLastMatchResult === 'w' ) {
    firstCompetitor[firstCompetitorName]['rating']   = Math.round(firstCompetitorRating + ifFirstCompetitorWins);
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorLoses);
  } else {
    firstCompetitor[firstCompetitorName]['rating']   = Math.round(firstCompetitorRating + ifFirstCompetitorLoses);
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorWins);
  }
  firstCompetitorRecord  = firstCompetitor[firstCompetitorName]['record'];
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

//should record belt of opponent too
//should also record the match number in the field
//would help keep everything in place
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

// var callNextCompetitor = function(bullPen){
//   theCompetitionMats.push(bullPen.pop());
// }

// var fightAllOtherBelts = function(theCompetitionMats,bullPen,k){
//   for ( let i = 0; i < bullPen.length/144; i++ ) {
//     // scribe(theCompetitionMats);
//     // referee(firstCompetitorBeltRank,secondCompetitorBeltRank);
//     // ratingsAdjuster(theCompetitionMats,k)
//     // competitionMatDepopulator(firstCompetitorRecord,theCompetitionMats);
//     theCompetitionMats.push(bullPen.pop())
//   }
// }

/**
 * @name - competitionMatDepopulator
 * @description - Checks last entry of firstCompetitorRecord
 *                Then places winner of match into innersBracket
 *                And loser of match into losersBracket
 * @param - firstCompetitorRecord
 * @param - theCompetitionMats
 **/
var competitionMatDepopulator = function(firstCompetitorRecord,theCompetitionMats){
  if ( firstCompetitorRecord.charAt(firstCompetitorRecord.length-1) === 'w' ) {
    losersBracket.push(theCompetitionMats.pop());
  }
};

/**
 * @name - mundialTournament
 * @description - Makes all competitorObjects in bullPen compete once
 *                **bullPenGenerator -- builds competitors; populates bullPen
 *                **roundsCalculator -- calculates the number of rounds 1st and 2nd will fight!
 *                Invokes runAllMatchesForOneRound() for numberOfRounds
 * @param - integer
 * @param - k-factor
 **/
var mundialTournament = function(demographicInformation,k){
  bullPenGenerator(demographicInformation);
  console.log("BEFORE ASSIGNMENT --> bullPen had",bullPen.length,"number of competitors!");
  separateBelts(demographicInformation,bullPen);
  competitionMatPopulator(aboutToCompeteArray,bullPen);

  //these steps will probably have to sit in their own cycle
  for ( let i = 0; i < bullPenLength; i++ ) {
    scribe(theCompetitionMats);
    referee(firstCompetitorBeltRank,secondCompetitorBeltRank);
    ratingsAdjuster(theCompetitionMats,k)
    competitionMatDepopulator(firstCompetitorRecord,theCompetitionMats);
    if ( bullPen.length !== 0 ) {
      theCompetitionMats.push(bullPen.pop())
    }
  }
  bullPen = losersBracket;
  losersBracket = [];




  // console.log("aboutToCompeteArray:",aboutToCompeteArray);
  console.log("bullPen:",bullPen);
  console.log("theCompetitionMats:",theCompetitionMats);
  console.log("theCompetitionMats.length:",theCompetitionMats.length);

  console.log("bullPen had",bullPen.length,"number of competitors!");

  console.log("winnersBracket:",winnersBracket);
  console.log("losersBracket:",losersBracket);
  // console.log("TOURNAMENT'S WINNER!",bullPen[0]);

  // console.log("winnersBracket.length:",winnersBracket.length);
  console.log("losersBracket.length:",losersBracket.length);
};

// Will generate competitors equal to sum of demographicInformation which will
// Compete each belt vs each other belt
// Until a winner is declared.
// k is the maximal number of points a player can win/lose in a given match
mundialTournament(demographicInformation,25);