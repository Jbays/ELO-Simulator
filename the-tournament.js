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

var theCompetitionMat = []
var competitionMatOdds = []
var winnersBracket    = []
var losersBracket     = []

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

// var probabilityCalculator = function(array){
//
//
//
// }

var ratingsAdjuster = function(array) {

  //BEGIN step one!
  // console.log("theCompetitionFloor:",array)

  var firstCompetitor  = array[0]
  var secondCompetitor = array[1]
  var nameOfFirstCompetitor  = Object.keys(firstCompetitor)[0]
  var nameOfSecondCompetitor = Object.keys(secondCompetitor)[0]

  // console.log("firstOpponent:",firstCompetitor)
  // console.log("Name of First Competitor:",nameOfFirstCompetitor)
  // console.log("secondOpponent:",secondCompetitor)
  // console.log("Name of Second Competitor:",nameOfSecondCompetitor)

  var firstCompetitorRating  = firstCompetitor[nameOfFirstCompetitor]['rating']
  var secondCompetitorRating = secondCompetitor[nameOfSecondCompetitor]['rating']

  // console.log("firstCompetitorRating:",firstCompetitorRating)
  // console.log("secondCompetitorRating:",secondCompetitorRating)

  // TODO: rename these next six variables!
  var recordWinsForA    = firstCompetitor[nameOfFirstCompetitor]['wins']
  var recordWinsForB    = secondCompetitor[nameOfSecondCompetitor]['wins']
  var recordLossesForA  = firstCompetitor[nameOfFirstCompetitor]['losses']
  var recordLossesForB  = secondCompetitor[nameOfSecondCompetitor]['losses']

  var probabilityOfVictoryForA = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)))
  var probabilityOfVictoryForB = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)))

  competitionMatOdds.push(probabilityOfVictoryForA)
  competitionMatOdds.push(probabilityOfVictoryForB)

  // console.log("probabilityOfVictoryForA:", probabilityOfVictoryForA)
  // console.log("probabilityOfVictoryForB:", probabilityOfVictoryForB)
  // console.log("recordWinsForA:",recordWinsForA)
  // console.log("recordWinsForB:",recordWinsForB)
  // console.log("recordLossesForA:",recordLossesForA)
  // console.log("recordLossesForB:",recordLossesForB)

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