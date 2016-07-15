'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]
var bullPen            = []
var theCompetitionMat  = []
var winnersBracket     = []
var losersBracket      = []
var competitorsSquared = 4

//k is the maximal number of points a player can win/lose in a given match
var k = 8
var n = 1

var firstCompetitor       = null
var firstCompetitorName   = null
var firstCompetitorRating = null
var firstCompetitorWins   = 0
var firstCompetitorLosses = 0
var firstCompetitorsProbabilityOfVictory  = 0
var firstCompetitorRecord = null

var secondCompetitor       = null
var secondCompetitorName   = null
var secondCompetitorRating = null
var secondCompetitorWins   = 0
var secondCompetitorLosses = 0
var secondCompetitorsProbabilityOfVictory = 0
var secondCompetitorRecord = null

var bullPenGenerator = function(integer) {
  var squaredNumber = integer * integer
  var competitorAssembler = function (squaredNumber) {
    console.log("Number of Competitors In Your Tournament:",squaredNumber)
    for (var j = 1; j <= squaredNumber; j++) {
      let yourNumber = j.toString()
      let competitorBlueprint = '{"c' + yourNumber
                                      + '":{"rating":1600,"wins":0,"losses":0,"record":"","opponents":""}}'

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
  firstCompetitorName  = Object.keys(firstCompetitor)[0]
  secondCompetitorName = Object.keys(secondCompetitor)[0]
  firstCompetitorRating  = firstCompetitor[firstCompetitorName]['rating']
  secondCompetitorRating = secondCompetitor[secondCompetitorName]['rating']
  firstCompetitorWins    = firstCompetitor[firstCompetitorName]['wins']
  firstCompetitorLosses  = firstCompetitor[firstCompetitorName]['losses']
  firstCompetitorRecord  = firstCompetitor[firstCompetitorName]['record']

  secondCompetitorWins   = secondCompetitor[secondCompetitorName]['wins']
  secondCompetitorLosses = secondCompetitor[secondCompetitorName]['losses']
  secondCompetitorRecord  = secondCompetitor[secondCompetitorName]['record']


  console.log("firstCompetitorRecord:",firstCompetitorRecord)
  console.log("secondCompetitorRecord:",secondCompetitorRecord)
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
    if ( firstCompetitorWins === 0 ) {
      firstCompetitor[firstCompetitorName]['wins']++
      secondCompetitor[secondCompetitorName]['losses']++
    } else {
      firstCompetitor[firstCompetitorName]['wins']++
      secondCompetitor[secondCompetitorName]['losses']++
    }
  } else {
    if ( secondCompetitorWins === 0 ) {
      firstCompetitor[firstCompetitorName]['losses']++
      secondCompetitor[secondCompetitorName]['wins']++
    } else {
      firstCompetitor[firstCompetitorName]['losses']++
      secondCompetitor[secondCompetitorName]['wins']++
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
  var rawNewRatingForFirst = firstCompetitorRating + k*(firstCompetitor[firstCompetitorName]['wins'] - (firstCompetitorsProbabilityOfVictory*n))
  var rawNewRatingForSecond = secondCompetitorRating + k*(secondCompetitor[secondCompetitorName]['wins'] - (secondCompetitorsProbabilityOfVictory*n))
  var newRatingForFirst = Math.round(rawNewRatingForFirst)
  var newRatingForSecond = Math.round(rawNewRatingForSecond)

  firstCompetitor[firstCompetitorName]['rating']   = newRatingForFirst
  secondCompetitor[secondCompetitorName]['rating'] = newRatingForSecond

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
  if ( firstCompetitor[firstCompetitorName]['losses'] ) {
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

var swissTournament = function(numberOfRoundsDesired){

  bullPenGenerator(competitorsSquared)

  for ( let i = 0; i < numberOfRoundsDesired; i++ ) {
    makeAllCompetitorsCompete(bullPen)
    makeNewBullPen(winnersBracket,losersBracket)
    winnersBracket = []
    losersBracket  = []
  }

  console.log("from swissTournament --> bullPen:",bullPen)
}

swissTournament(2)