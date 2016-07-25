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
  console.log("bullPen:",bullPen)
  console.log("bullPen had",bullPen.length,"number of competitors!")
    // runAllMatchesForOneRound(bullPen,k);
  // console.log("losersBracket:",losersBracket);
  // console.log("TOURNAMENT'S WINNER!",bullPen[0]);
  // console.log("winnersBracket.length:",winnersBracket.length);
  // console.log("losersBracket.length:",losersBracket.length);
};

// Will generate n^2 competitors which will
// Compete in a single-elimination tournament
// Until a winner is declared.
// k is the maximal number of points a player can win/lose in a given match
singleEliminationTournament(4,25);