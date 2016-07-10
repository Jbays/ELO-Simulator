'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]
var bullPen            = []
var theCompetitionMat  = []
var winnersBracket     = []
var losersBracket      = []
var firstCompetitorsProbabilityOfVictory  = 0
var secondCompetitorsProbabilityOfVictory = 0
var competitorsSquared = 4

//k is the maximal number of points a player can win/lose in a given match
var k = 8
var n = 1

var bullPenGenerator = function(integer) {
  var squaredNumber = integer * integer
  var competitorAssembler = function (squaredNumber) {
    console.log("Number of Competitors In Your Tournament:",squaredNumber)
    for (var j = 1; j <= squaredNumber; j++) {
      let yourNumber = j.toString()
      let competitorBlueprint = '{"c' + yourNumber +'":{"rating":1600,"wins":0,"losses":0}}'

      bullPen.push(JSON.parse(competitorBlueprint))
    }
  }
  competitorAssembler(squaredNumber)
}



/**
 * @name - competitionMatPopulator
 * @description - Takes as input bullPen array
 *                Removes first and second competitors from bullPen
 *                And places them inside theCompetitionMat
 * @param - bullPen
 *
 **/
var competitionMatPopulator = function(array){
  theCompetitionMat.push(array.shift())
  theCompetitionMat.push(array.shift())
}

/**
 * @name - variableAssigner
 * @description - Assigns to variables all statistics relevant to calculations for
 *                the two competitors on theCompetitionMats.
 * @param - theCompetitionMats
 **/
var variableAssigner = function(array){
  firstCompetitor  = array[0]
  secondCompetitor = array[1]
  nameOfFirstCompetitor  = Object.keys(firstCompetitor)[0]
  nameOfSecondCompetitor = Object.keys(secondCompetitor)[0]
  firstCompetitorRating  = firstCompetitor[nameOfFirstCompetitor]['rating']
  secondCompetitorRating = secondCompetitor[nameOfSecondCompetitor]['rating']
  recordWinsForFirstCompetitor    = firstCompetitor[nameOfFirstCompetitor]['wins']
  recordLossesForFirstCompetitor  = firstCompetitor[nameOfFirstCompetitor]['losses']
  recordWinsForSecondCompetitor   = secondCompetitor[nameOfSecondCompetitor]['wins']
  recordLossesForSecondCompetitor = secondCompetitor[nameOfSecondCompetitor]['losses']

  // console.log("firstCompetitor[name]['wins']:",firstCompetitor[nameOfFirstCompetitor]['wins'])
  // console.log("Name of First Competitor:",nameOfFirstCompetitor)
  // console.log("secondCompetitor[name]:",secondCompetitor[nameOfSecondCompetitor])
  // console.log("Name of Second Competitor:",nameOfSecondCompetitor)
  // console.log("firstCompetitorRating:",firstCompetitorRating)
  // console.log("secondCompetitorRating:",secondCompetitorRating)

}

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

var swissTournament = function(numberOfRoundsDesired){

  bullPenGenerator(competitorsSquared)
  competitionMatPopulator(bullPen)
  variableAssigner(theCompetitionMat)



  for ( var k = 0; k < numberOfRoundsDesired; k++ ) {

    // console.log("hello sailor!")


  }


}

swissTournament(2)