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
var competitorsSquared = 16

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
}

/**
 * @name - probabilityCalculator
 * @description - Calculates the likelihood of victory for the competitors
 *                on theCompetitionMats. Calculation based on the players's
 *                respective rating
 * @param - firstCompetitorRating
 * @param - secondCompetitorRating
 **/
var probabilityCalculator = function(firstCompetitorRating,secondCompetitorRating){
  firstCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)))
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)))
}

/**
 * @name - referee
 * @description - Pulls a random draw (between 0-1) and assigns a victory based
 *                on firstCompetitorsProbabilityOfVictory
 * @param - theCompetitorMats
 * @param - firstCompetitorsProbabilityOfVictory
 **/
var referee = function(array,probability){
  var randomNumber = Math.random()

  if ( probability > randomNumber ) {
    if ( recordWinsForFirstCompetitor === 0 ) {
      firstCompetitor[nameOfFirstCompetitor]['wins']++
      secondCompetitor[nameOfSecondCompetitor]['losses']++
    } else {
      firstCompetitor[nameOfFirstCompetitor]['wins']++
      secondCompetitor[nameOfSecondCompetitor]['losses']++
    }
  } else {
    if ( recordWinsForSecondCompetitor === 0 ) {
      firstCompetitor[nameOfFirstCompetitor]['losses']++
      secondCompetitor[nameOfSecondCompetitor]['wins']++
    } else {
      firstCompetitor[nameOfFirstCompetitor]['losses']++
      secondCompetitor[nameOfSecondCompetitor]['wins']++
    }
  }
}

/**
 * @name - ratingsAdjuster
 * @description - Calculates the raw new ratings for the competitors after
 *                the results of their match has been tabulated.
 *                Rounds raw rating, then assigns new rating to competitor
 **/
var ratingsAdjuster = function() {
  var rawNewRatingForFirst = firstCompetitorRating + k*(firstCompetitor[nameOfFirstCompetitor]['wins'] - (firstCompetitorsProbabilityOfVictory*n))
  var rawNewRatingForSecond = secondCompetitorRating + k*(secondCompetitor[nameOfSecondCompetitor]['wins'] - (secondCompetitorsProbabilityOfVictory*n))
  var newRatingForFirst = Math.round(rawNewRatingForFirst)
  var newRatingForSecond = Math.round(rawNewRatingForSecond)

  firstCompetitor[nameOfFirstCompetitor]['rating']   = newRatingForFirst
  secondCompetitor[nameOfSecondCompetitor]['rating'] = newRatingForSecond

  //TODO: this needs to be refactored to handle two newRatings simultaneously
  // if (newRating === competitorRating && competitorRating < rawNewRating ) {
  //
  //   competitor[competitorStats[0]] = newRating+1
  //
  // } else if ( newRating === competitorRating && competitorRating > rawNewRating ) {
  //
  //   competitor[competitorStats[0]] = newRating-1
  //
  // } else {
  //
  //   competitor[competitorStats[0]] = newRating
  //
  // }
}

/**
 * @name - competitionMatDepopulator
 * @description - Takes as input bullPen array
 *                Removes both competitors from theCompetitionMat
 *                Places winner of match into Winners Bracket
 *                And loser of match into Losers Bracket
 * @param - theCompetitionMat
 **/
var competitionMatDepopulator = function(array){
  if ( firstCompetitor[nameOfFirstCompetitor]['losses'] ) {
    winnersBracket.push(array.pop())
    losersBracket.push(array.pop())
  } else {
    losersBracket.push(array.pop())
    winnersBracket.push(array.pop())
  }
}

var makeNewBullPen = function(winnersBracket, losersBracket){
  bullPen = winnersBracket
  var winnersLength = winnersBracket.length
  for ( let i = 0; i < winnersLength; i++ ) {
    bullPen.push(losersBracket[i])
  }
  bullPen = _.shuffle(bullPen)
}

var makeAllCompetitorsCompete = function(array){
  var numberOfMatches = array.length/2
  for ( let i = 0; i < numberOfMatches; i++ ) {
    competitionMatPopulator(bullPen)
    variableAssigner(theCompetitionMat)
    probabilityCalculator(firstCompetitorRating,secondCompetitorRating)
    referee(theCompetitionMat, firstCompetitorsProbabilityOfVictory)
    ratingsAdjuster()
    competitionMatDepopulator(theCompetitionMat)
  }
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

  for ( let i = 0; i < numberOfRoundsDesired; i++ ) {
    makeAllCompetitorsCompete(bullPen)
    makeNewBullPen(winnersBracket,losersBracket)
    winnersBracket = []
    losersBracket  = []
  }

  console.log("from swissTournament --> bullPen:",bullPen)
  console.log("from swissTournament --> theCompetitionMat:",theCompetitionMat)
  console.log("from swissTournament --> winnersBracket:",winnersBracket)
  console.log("from swissTournament --> losersBracket:",losersBracket)
}

swissTournament(8)