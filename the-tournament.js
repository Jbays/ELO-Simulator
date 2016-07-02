/**
 * Created by justin.baize on 6/16/16.
 */

'use strict'
var fs = require('fs');
var _  = require('lodash');

var c01 = { rating:1600, wins:0, losses:0 }
var c02 = { rating:1600, wins:0, losses:0 }
var c03 = { rating:1600, wins:0, losses:0 }
var c04 = { rating:1600, wins:0, losses:0 }
var c05 = { rating:1600, wins:0, losses:0 }
var c06 = { rating:1600, wins:0, losses:0 }
var c07 = { rating:1600, wins:0, losses:0 }
var c08 = { rating:1600, wins:0, losses:0 }
var c09 = { rating:1600, wins:0, losses:0 }
var c10 = { rating:1600, wins:0, losses:0 }
var c11 = { rating:1600, wins:0, losses:0 }
var c12 = { rating:1600, wins:0, losses:0 }
var c13 = { rating:1600, wins:0, losses:0 }
var c14 = { rating:1600, wins:0, losses:0 }
var c15 = { rating:1600, wins:0, losses:0 }
var c16 = { rating:1600, wins:0, losses:0 }
var c17 = { rating:1600, wins:0, losses:0 }
var c18 = { rating:1600, wins:0, losses:0 }
var c19 = { rating:1600, wins:0, losses:0 }
var c20 = { rating:1600, wins:0, losses:0 }
var c21 = { rating:1600, wins:0, losses:0 }
var c22 = { rating:1600, wins:0, losses:0 }
var c23 = { rating:1600, wins:0, losses:0 }
var c24 = { rating:1600, wins:0, losses:0 }
var c25 = { rating:1600, wins:0, losses:0 }
var c26 = { rating:1600, wins:0, losses:0 }
var c27 = { rating:1600, wins:0, losses:0 }
var c28 = { rating:1600, wins:0, losses:0 }
var c29 = { rating:1600, wins:0, losses:0 }
var c30 = { rating:1600, wins:0, losses:0 }
var c31 = { rating:1600, wins:0, losses:0 }
var c32 = { rating:1600, wins:0, losses:0 }

var theCompetitionMat  = []
var winnersBracket     = []
var losersBracket      = []
var firstCompetitorsProbabilityOfVictory  = 0
var secondCompetitorsProbabilityOfVictory = 0
var numberOfRequiredRounds = 4

var k = 16
var n = 1

var arrayOfCompetitors = [
  {c01},{c02},{c03},{c04},{c05},{c06},{c07},{c08},
  {c09},{c10},{c11},{c12},{c13},{c14},{c15},{c16},
  {c17},{c18},{c19},{c20},{c21},{c22},{c23},{c24},
  {c25},{c26},{c27},{c28},{c29},{c30},{c31},{c32}
]

/**
 * @name matPopulator
 * @description - Takes two competitors from arrayOfCompetitors and
 *                puts them into theCompetitionMat array.
 * @param arrayOfCompetitors
 **/

var competitorGenerator = function(number) {

  var outputArr = []
  var allCompetitorsObj = {}
  var squared = number * number
  var prototypeCompetitor = {rating: 1600, wins: 0, losses: 0}

  //this will output an object with
  //competitors === squared
  //outputObj: {
  //             c(n): { rating: 1600, wins: 0, losses: 0 },
  //             c(n+1): { rating: 1600, wins: 0, losses: 0 },
  //             c(n+2): { rating: 1600, wins: 0, losses: 0 },
  //           }
  var competitorCreator = function (squared) {
    var tempArr = []
    var tempArr2 = []

    for (var j = 1; j <= squared; j++) {
      var name = "c" + j.toString()

      tempArr.push(name)
      tempArr2.push(prototypeCompetitor)
    }
    allCompetitorsObj = _.zipObject(tempArr, tempArr2)
  }

  competitorCreator(squared)

  var bullPenCreator = function(object){

    var bullPen = []

    console.log("from bullPenCreator --> object:",object)

    var competitorsName = Object.keys(object)
    var numberOfCompetitors = competitorsName.length


    // console.log("competitorsName:",competitorsName)
    // console.log("numberOfCompetitors:",numberOfCompetitors)

    for ( var k = 1; k <= numberOfCompetitors; k++) {

      //_.values(obj) might be the way

      //this seems like the wrong direction
      // console.log("object[k]:",object[competitorsName[k]])

      // bullPen.push(object[k])

    }

  }

  bullPenCreator(allCompetitorsObj)

}

competitorGenerator(numberOfRequiredRounds)

var tournamentCoordinator = function(array){

  // console.log("tournamentCoordinator's array:",array)
  // console.log("arrayOfCompetitors.length:",array.length)

  for ( var i = 0; i < array.length; i++ ) {

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

  // console.log("firstCompetitor:",firstCompetitor)
  // console.log("Name of First Competitor:",nameOfFirstCompetitor)
  // console.log("secondCompetitor:",secondCompetitor)
  // console.log("Name of Second Competitor:",nameOfSecondCompetitor)
  // console.log("firstCompetitorRating:",firstCompetitorRating)
  // console.log("secondCompetitorRating:",secondCompetitorRating)

    var matPopulator = function(array){
      theCompetitionMat.push(array.shift())
      theCompetitionMat.push(array.shift())
    }
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
    var probabilityCalculator = function(array){

      // TODO: rename these next six variables!

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
    var matEvacuator = function(array){
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

    matPopulator(array)
    variableAssigner(theCompetitionMat)
    probabilityCalculator(theCompetitionMat)
    referee(theCompetitionMat, firstCompetitorsProbabilityOfVictory)
    ratingsAdjuster()
    matEvacuator(theCompetitionMat)

  }

  // console.log("arrayOfCompetitors:",arrayOfCompetitors)
  // console.log("winnersBracket:",winnersBracket)
  // console.log("losersBracket:",losersBracket)

  if ( array.length === 1 ) {
    console.log("YOU ARE THE WINNER!:",array[0])
    console.log("Loser's Bracket:",losersBracket)
  } else if ( array.length === 0 ) {
    console.log("you ran out of competitors!")
    tournamentCoordinator(winnersBracket)
  } else if ( array.length ) {
    console.log("hello sailor!  We still have fights left!")
    tournamentCoordinator(array)
  }

}

// tournamentCoordinator(arrayOfCompetitors)
