'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]
var numberOfRounds = null;

var demographicInformation = [144,306,551,642,198];
var jiujitsuBelts = ['black','brown','purple','blue','white'];

var bullPen            = [];
var theCompetitionMats = [];
var aboutToCompeteArray = []
var winnersBracket     = [];
var losersBracket      = [];
var nSquared           = null;
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

var bullPenGenerator = function(demographicInformation) {
  let counter = 1;

  var competitorAssembler = function(demographicInformation){
    for ( let j = 0; j < demographicInformation.length; j++ ) {
      for ( let i = 1; i <= demographicInformation[j]; i++ ) {
        let competitorNameBlueprint = counter.toString();
        let competitorBlueprint = '{"c' + competitorNameBlueprint
                                + '":{"rating":1600,"wins":0,"losses":0,"record":"","matches":"","belt":'
                                + '"' + jiujitsuBelts[j]+ '"' + '}}';
        counter++;

        bullPen.push(JSON.parse(competitorBlueprint));
      }
    }
  };
  competitorAssembler(demographicInformation);
};

var separateBelts = function(demographicInformation,bullPen){
  let leadingBelt      = Object.keys(bullPen[0]);
  let leadingBeltColor = bullPen[0][leadingBelt]['belt']
  let numberOfBelts = demographicInformation.shift();

  for ( let i = 0; i < numberOfBelts; i++ ) {
    aboutToCompeteArray.push(bullPen.shift());
  }

  console.log("separateBelts invoked!");
  console.log("leadingBelt:",leadingBelt);
  console.log("leadingBeltColor:",leadingBeltColor);
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
  theCompetitionMats.push(bullPen.shift())
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
  separateBelts(demographicInformation,bullPen);
  competitionMatPopulator(aboutToCompeteArray,bullPen);

  console.log("aboutToCompeteArray:",aboutToCompeteArray);
  console.log("bullPen:",bullPen);
  console.log("theCompetitionMats:",theCompetitionMats);
  console.log("bullPen had",bullPen.length,"number of competitors!");


  // console.log("losersBracket:",losersBracket);
  // console.log("TOURNAMENT'S WINNER!",bullPen[0]);
  // console.log("winnersBracket.length:",winnersBracket.length);
  // console.log("losersBracket.length:",losersBracket.length);
};

// Will generate n^2 competitors which will
// Compete in a single-elimination tournament
// Until a winner is declared.
// k is the maximal number of points a player can win/lose in a given match
mundialTournament(demographicInformation,25);