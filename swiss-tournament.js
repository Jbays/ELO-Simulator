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

/**
 * @name - probabilityCalculator
 * @description - Calculates the likelihood of victory for the competitors
 *                on theCompetitionMats. Calculation based on the players's
 *                respective rating
 * @param - firstCompetitorRating
 * @param - secondCompetitorRating
 **/
var probabilityCalculator = function(firstCompetitorRating,secondCompetitorRating){

  // var recordWinsForA    = firstCompetitor[nameOfFirstCompetitor]['wins']
  // var recordWinsForB    = secondCompetitor[nameOfSecondCompetitor]['wins']
  // var recordLossesForA  = firstCompetitor[nameOfFirstCompetitor]['losses']
  // var recordLossesForB  = secondCompetitor[nameOfSecondCompetitor]['losses']

  firstCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)))
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)))

  // competitionMatOdds.push(probabilityOfVictoryForA)
  // competitionMatOdds.push(probabilityOfVictoryForB)

  // console.log("firstCompetitorsProbabilityOfVictory:", firstCompetitorsProbabilityOfVictory)
  // console.log("secondCompetitorsProbabilityOfVictory:", secondCompetitorsProbabilityOfVictory)
  // console.log("recordWinsForA:",recordWinsForA)
  // console.log("recordWinsForB:",recordWinsForB)
  // console.log("recordLossesForA:",recordLossesForA)
  // console.log("recordLossesForB:",recordLossesForB)
  // console.log("theCompetitionFloor:",array)
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

    // console.log("first person wins!")
    // console.log("second person loses!")

    // console.log("firstCompetitor[nameOfFirstCompetitor]['wins']:",firstCompetitor[nameOfFirstCompetitor]['wins'])
    // console.log("secondCompetitor[nameOfSecondCompetitor]['wins']:"secondCompetitor[nameOfSecondCompetitor]['wins'])

    if ( recordWinsForFirstCompetitor === 0 ) {

      // console.log("the first competitor has no wins!")
      firstCompetitor[nameOfFirstCompetitor]['wins']++
      secondCompetitor[nameOfSecondCompetitor]['losses']++

    } else {

      // console.log("the first competitor has no wins!")
      firstCompetitor[nameOfFirstCompetitor]['wins']++
      secondCompetitor[nameOfSecondCompetitor]['losses']++

    }

    // recordWinsForFirstCompetitor++
    // recordLossesForSecondCompetitor++

    // firstCompetitor[nameOfFirstCompetitor]['wins']     = recordWinsForFirstCompetitor
    // console.log("*****firstCompetitor:",firstCompetitor)
    // console.log("*****firstCompetitor[nameOfFirstCompetitor]:",firstCompetitor[nameOfFirstCompetitor])

    // console.log("firstCompetitor[nameOfFirstCompetitor]['wins']:",firstCompetitor[nameOfFirstCompetitor]['wins'])
    // secondCompetitor[nameOfSecondCompetitor]['losses'] = recordLossesForSecondCompetitor
    // console.log("secondCompetitor[nameOfFirstCompetitor]['losses']:",secondCompetitor[nameOfFirstCompetitor]['losses'])


  } else {

    // console.log("first person loses!")
    // console.log("second person wins!")

    if ( recordWinsForSecondCompetitor === 0 ) {

      // console.log("the second competitor has no wins!")
      firstCompetitor[nameOfFirstCompetitor]['losses']++
      secondCompetitor[nameOfSecondCompetitor]['wins']++

    } else {
      // console.log("the second competitor has some wins!")

      firstCompetitor[nameOfFirstCompetitor]['losses']++
      secondCompetitor[nameOfSecondCompetitor]['wins']++

    }

    // recordLossesForFirstCompetitor++
    // recordWinsForSecondCompetitor++

    // console.log("recordWinsForA:",recordWinsForA)
    // console.log("recordWinsForB:",recordWinsForB)

    // firstCompetitor[nameOfFirstCompetitor]['losses'] = recordLossesForFirstCompetitor
    // console.log("*****firstCompetitor:",firstCompetitor)

    // console.log("*****firstCompetitor[nameOfFirstCompetitor]:",firstCompetitor[nameOfFirstCompetitor])
    // console.log("*****firstCompetitor[nameOfFirstCompetitor]['losses']:",firstCompetitor[nameOfFirstCompetitor]['losses'])

    // secondCompetitor[nameOfSecondCompetitor]['wins'] = recordWinsForSecondCompetitor
    // console.log("secondCompetitor[nameOfFirstCompetitor]['wins']:",secondCompetitor[nameOfFirstCompetitor]['wins'])

  }
}

/**
 * @name - ratingsAdjuster
 * @description - Calculates the raw new ratings for the competitors after
 *                the results of their match has been tabulated.
 *                Rounds raw rating, then assigns new rating to competitor
 **/
var ratingsAdjuster = function() {

  // console.log("after referee() theCompetitionMat:",theCompetitionMat)
  // console.log("ratingsAdjuster's array:",array)
  // console.log("firstCompetitorRating:",firstCompetitorRating)
  // console.log("secondCompetitorRating:",secondCompetitorRating)

  var rawNewRatingForFirst = firstCompetitorRating + k*(firstCompetitor[nameOfFirstCompetitor]['wins'] - (firstCompetitorsProbabilityOfVictory*n))
  var rawNewRatingForSecond = secondCompetitorRating + k*(secondCompetitor[nameOfSecondCompetitor]['wins'] - (secondCompetitorsProbabilityOfVictory*n))

  // console.log("rawNewRatingForFirst:",rawNewRatingForFirst)
  // console.log("rawNewRatingForSecond:",rawNewRatingForSecond)

  var newRatingForFirst = Math.round(rawNewRatingForFirst)
  var newRatingForSecond = Math.round(rawNewRatingForSecond)

  // console.log("newRatingForFirst:",newRatingForFirst)
  // console.log("newRatingForSecond:",newRatingForSecond)

  firstCompetitor[nameOfFirstCompetitor]['rating']   = newRatingForFirst
  secondCompetitor[nameOfSecondCompetitor]['rating'] = newRatingForSecond

  // console.log("after everything --> ratingsAdjuster's array:",array)

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
  // console.log("this should be the competitionFloor!:",array)

  if ( firstCompetitor[nameOfFirstCompetitor]['losses'] ) {

    // console.log("the first competitor lost!")
    winnersBracket.push(array.pop())
    losersBracket.push(array.pop())
    // console.log("winnersBracket:",winnersBracket)
    // console.log("losersBracket:",losersBracket)

  } else {

    // console.log("the second person lost!")
    losersBracket.push(array.pop())
    winnersBracket.push(array.pop())

    // console.log("losersBracket:",losersBracket)
    // console.log("winnersBracket:",winnersBracket)

    // console.log("array after populating losers and winners brackets:",array)
    // console.log("arrayOfCompetitors:",arrayOfCompetitors)

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

  var roundOneFight = bullPen.length/2

  for ( var k = 1; k <= roundOneFight; k++ ) {

    competitionMatPopulator(bullPen)
    variableAssigner(theCompetitionMat)
    probabilityCalculator(firstCompetitorRating,secondCompetitorRating)
    referee(theCompetitionMat, firstCompetitorsProbabilityOfVictory)
    ratingsAdjuster()
    competitionMatDepopulator(theCompetitionMat)

  }

  console.log("winnersBracket:",winnersBracket)
  console.log("losersBracket:",losersBracket)


  if ( bullPen.length !== 0 ) {



  }

  // for ( var k = 0; k < numberOfRoundsDesired; k++ ) {
  //
  //   // console.log("hello sailor!")
  //
  //
  // }


}

swissTournament(2)