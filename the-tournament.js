/**
 * Created by justin.baize on 6/16/16.
 */
var fs = require('fs');
var _  = require('lodash');

var competitorA = {
  rating: 1200,
  wins: 0,
  losses: 0
}

var competitorB = {
  rating: 1400,
  wins:   0,
  losses: 0
}

var competitorC = {
  rating: 1600,
  wins:   0,
  losses: 0
}

var competitorD = {
  rating: 1800,
  wins:   0,
  losses: 0
}

var theCompetitionMat  = []
var competitionMatOdds = []
var winnersBracket     = []
var losersBracket      = []
var firstCompetitorRating  = 0
var secondCompetitorRating = 0
var firstCompetitorsProbabilityOfVictory = 0
var secondCompetitorsProbabilityOfVictory = 0
var firstCompetitor = null
var secondCompetitor = null
var nameOfFirstCompetitor  = null
var nameOfSecondCompetitor = null

var firstCompetitorRating = null
var secondCompetitorRating = null


var k = 8
var n = 1

var arrayOfCompetitors = [{competitorA},{competitorB},{competitorC},{competitorD}]


/**
 * @name matPopulator
 * @description - Takes two competitors from arrayOfCompetitors and
 *                puts them into theCompetitionMat array.
 * @param arrayOfCompetitors
 **/

var matPopulator = function(array){

  theCompetitionMat.push(array.pop())
  theCompetitionMat.push(array.pop())

}

matPopulator(arrayOfCompetitors)

var probabilityCalculator = function(array){

  firstCompetitor  = array[0]
  secondCompetitor = array[1]
  nameOfFirstCompetitor  = Object.keys(firstCompetitor)[0]
  nameOfSecondCompetitor = Object.keys(secondCompetitor)[0]

  firstCompetitorRating  = firstCompetitor[nameOfFirstCompetitor]['rating']
  secondCompetitorRating = secondCompetitor[nameOfSecondCompetitor]['rating']

  // console.log("firstOpponent:",firstCompetitor)
  // console.log("Name of First Competitor:",nameOfFirstCompetitor)
  // console.log("secondOpponent:",secondCompetitor)
  // console.log("Name of Second Competitor:",nameOfSecondCompetitor)
  // console.log("firstCompetitorRating:",firstCompetitorRating)
  // console.log("secondCompetitorRating:",secondCompetitorRating)
}

probabilityCalculator(theCompetitionMat)

var ratingAdjustersss = function(array){
  var recordWinsForA    = firstCompetitor[nameOfFirstCompetitor]['wins']
  var recordWinsForB    = secondCompetitor[nameOfSecondCompetitor]['wins']
  var recordLossesForA  = firstCompetitor[nameOfFirstCompetitor]['losses']
  var recordLossesForB  = secondCompetitor[nameOfSecondCompetitor]['losses']

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
  //
  // console.log("theCompetitionFloor:",array)

}

ratingAdjustersss(theCompetitionMat)



var ratingsAdjuster = function(array) {

  //BEGIN step one!
  console.log("theCompetitionFloor:",array)

  // TODO: rename these next six variables!

  //END step one!

  //BEGIN step two!

  var outcomeCalculator = function (probabilityOfVictoryForA) {

    var randomNumber = Math.random()

    if ( probabilityOfVictoryForA > randomNumber ) {

      recordWinsForA++
      recordLossesForB++

      firstCompetitor[nameOfFirstCompetitor]['wins']     = recordWinsForA
      secondCompetitor[nameOfSecondCompetitor]['losses'] = recordLossesForB

    } else {

      recordLossesForA++
      recordWinsForB++

      firstCompetitor[nameOfFirstCompetitor]['losses'] = recordLossesForA
      secondCompetitor[nameOfSecondCompetitor]['wins'] = recordWinsForB

    }

    // console.log("after outcomeCalculator firstCompetitor:",firstCompetitor)
    // console.log("after outcomeCalculator secondCompetitor:",secondCompetitor)

  }

  outcomeCalculator(probabilityOfVictoryForA)
  //END step two!

  //BEGIN step three!
  var newRatingCalculator = function(array){

    // console.log("this should be the competitionMat:",array1)

    // var probabilityOfVictoryForFirst = array2[0]
    // var probabilityOfVictoryForSecond = array2[1]

    // console.log("**firstOpponent:",firstCompetitor)
    // console.log("**Name of First Competitor:",nameOfFirstCompetitor)
    // console.log("**secondOpponent:",secondCompetitor)
    // console.log("**Name of Second Competitor:",nameOfSecondCompetitor)

    // console.log("firstCompetitorRating:",firstCompetitorRating)
    // console.log("secondCompetitorRating:",secondCompetitorRating)

    var rawNewRatingForFirst = firstCompetitorRating + k*(firstCompetitor[nameOfFirstCompetitor]['wins'] - (probabilityOfVictoryForA*n))
    var rawNewRatingForSecond = secondCompetitorRating + k*(secondCompetitor[nameOfSecondCompetitor]['wins'] - (probabilityOfVictoryForB*n))

    // console.log("rawNewRatingForFirst:",rawNewRatingForFirst)
    // console.log("rawNewRatingForSecond:",rawNewRatingForSecond)

    var newRatingForFirst = Math.round(rawNewRatingForFirst)
    var newRatingForSecond = Math.round(rawNewRatingForSecond)

    // console.log("newRatingForFirst:",newRatingForFirst)
    // console.log("newRatingForSecond:",newRatingForSecond)

    firstCompetitor[nameOfFirstCompetitor]['rating']   = newRatingForFirst
    secondCompetitor[nameOfSecondCompetitor]['rating'] = newRatingForSecond

    // console.log("after the smoke has cleared:",array1)


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

    // console.log("competitor:",competitor)

  }
  newRatingCalculator(theCompetitionMat)
  //END step three!

  //BEGIN step four!
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

      console.log("array after populating losers and winners brackets:",array)
      console.log("arrayOfCompetitors:",arrayOfCompetitors)

    }


  }
  matEvacuator(theCompetitionMat)
  //END step four!



  // working!

  // tournament(arrayOfCompetitors)


}

//working too
// ratingsAdjuster(competitorA,competitorB)

var tournament = function(array){

  // console.log("this should be the array of competitors:",array)




  // console.log("Reporting on the competition floor!:",theCompetitionMat)

  ratingsAdjuster(theCompetitionMat)

}

// tournament(arrayOfCompetitors)


// matPopulator(arrayOfCompetitors)