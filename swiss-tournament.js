'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]
var bullPen            = []
var theCompetitionMat  = []
var winnersBracket     = []
var losersBracket      = []
var competitorsSquared = 32

//k is the maximal number of points a player can win/lose in a given match
var k = 25

var firstCompetitor       = null
var firstCompetitorName   = null
var firstCompetitorRating = null
var firstCompetitorWins   = 0
var firstCompetitorLosses = 0
var firstCompetitorsProbabilityOfVictory  = 0
var firstCompetitorRecord = null
var ifFirstCompetitorWins  = null
var ifFirstCompetitorLoses = null

var secondCompetitor       = null
var secondCompetitorName   = null
var secondCompetitorRating = null
var secondCompetitorWins   = 0
var secondCompetitorLosses = 0
var secondCompetitorsProbabilityOfVictory = 0
var secondCompetitorRecord = null
var ifSecondCompetitorWins  = null
var ifSecondCompetitorLoses = null

/**
 * @name - bullPenGenerator
 * @description - Takes an integer as input
 *                Generates (integer^2) competitors from competitorBlueprint
 *                Where competitorBlueprint === "{cXXX:{
 *                                                      'rating':1600,'wins':0,'losses':0,'record':'','opponents':''}
 *                                                     }
 *                And puts all generated competitors into bullPen array
 * @param - integer
 **/
var bullPenGenerator = function(integer) {
  let squaredNumber = integer * integer
  var competitorAssembler = function (squaredNumber) {
    console.log("Number of Competitors In Your Tournament:",squaredNumber)
    for (let i = 1; i <= squaredNumber; i++) {
      let yourNumber = i.toString()
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
  firstCompetitor       = array[0]
  firstCompetitorName   = Object.keys(firstCompetitor)[0]
  firstCompetitorRating = firstCompetitor[firstCompetitorName]['rating']
  firstCompetitorWins   = firstCompetitor[firstCompetitorName]['wins']
  firstCompetitorLosses = firstCompetitor[firstCompetitorName]['losses']
  firstCompetitorRecord = firstCompetitor[firstCompetitorName]['record']

  secondCompetitor       = array[1]
  secondCompetitorName   = Object.keys(secondCompetitor)[0]
  secondCompetitorRating = secondCompetitor[secondCompetitorName]['rating']
  secondCompetitorWins   = secondCompetitor[secondCompetitorName]['wins']
  secondCompetitorLosses = secondCompetitor[secondCompetitorName]['losses']
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record']
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

var recordKeeper = function(){
  firstCompetitor[firstCompetitorName]['opponents'] = firstCompetitor[firstCompetitorName]['opponents']
    + firstCompetitorRating.toString()
    + "-" + secondCompetitorName
    + "-" + secondCompetitorRating.toString() + "***"
  secondCompetitor[secondCompetitorName]['opponents'] = secondCompetitor[secondCompetitorName]['opponents']
    + secondCompetitorRating.toString()
    + "-" + firstCompetitorName
    + "-" + firstCompetitorRating.toString() + "***"
}


/**
 * @name - referee
 * @description - Pulls a random draw (between 0-1) and assigns a victory based
 *                on firstCompetitorsProbabilityOfVictory
 * @param - theCompetitorMats
 * @param - firstCompetitorsProbabilityOfVictory
 **/
var referee = function(array,probability){
  let randomNumber = Math.random()
  recordKeeper()

  if ( probability > randomNumber ) {
    firstCompetitor[firstCompetitorName]['wins']++
    firstCompetitor[firstCompetitorName]['record'] = firstCompetitorRecord + "w"

    secondCompetitor[secondCompetitorName]['losses']++
    secondCompetitor[secondCompetitorName]['record'] = secondCompetitorRecord + "l"
  } else {
    firstCompetitor[firstCompetitorName]['losses']++
    firstCompetitor[firstCompetitorName]['record'] = firstCompetitorRecord + "l"

    secondCompetitor[secondCompetitorName]['wins']++
    secondCompetitor[secondCompetitorName]['record'] = secondCompetitorRecord + "w"
  }
}

var calculateTheRatingsAtStake = function(){
  ifFirstCompetitorWins  = k*(1 - firstCompetitorsProbabilityOfVictory)
  ifFirstCompetitorLoses = k*(-firstCompetitorsProbabilityOfVictory)
  ifSecondCompetitorWins = k*(1 - secondCompetitorsProbabilityOfVictory)
  ifSecondCompetitorLoses = k*(-secondCompetitorsProbabilityOfVictory)
}

/**
 * @name - ratingsAdjuster
 * @description - Calculates the raw new ratings for the competitors after
 *                the results of their match has been tabulated.
 *                Rounds raw rating, then assigns new rating to competitor
 **/
var ratingsAdjuster = function(array) {
  let firstCompetitorLastMatchResult = array[0][firstCompetitorName]['record'].slice(array[0][firstCompetitorName]['record'].length-1)
  calculateTheRatingsAtStake(theCompetitionMat)

  if ( firstCompetitorLastMatchResult === 'w' ) {
    firstCompetitor[firstCompetitorName]['rating']   = Math.round(firstCompetitorRating + ifFirstCompetitorWins)
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorLoses)
  } else {
    firstCompetitor[firstCompetitorName]['rating'] = Math.round(firstCompetitorRating + ifFirstCompetitorLoses)
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorWins)
  }
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
    ratingsAdjuster(theCompetitionMat)
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

swissTournament(30)