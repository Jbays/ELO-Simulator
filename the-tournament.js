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
  rating: 1800,
  wins:   0,
  losses: 0
}

var k = 8
var n = 1

var ratingsAdjuster = function(competitorA,competitorB) {

  var competitorARating = competitorA.rating
  var competitorBRating = competitorB.rating
  var recordWinsForA    = competitorA.wins
  var recordWinsForB    = competitorB.wins
  var recordLossesForA  = competitorA.losses
  var recordLossesForB  = competitorB.losses

  var probabilityOfVictoryForA = 1 / (1 + Math.pow(10, ((competitorBRating - competitorARating) / 400)))
  var probabilityOfVictoryForB = 1 / (1 + Math.pow(10, ((competitorARating - competitorBRating) / 400)))

  // console.log("probabilityOfVictoryForA:", probabilityOfVictoryForA)
  // console.log("probabilityOfVictoryForB:", probabilityOfVictoryForB)

  var outcomeCalculator = function (probabilityOfVictoryForA) {

    var randomNumber     = Math.random()

    if ( probabilityOfVictoryForA > randomNumber ) {

      recordWinsForA++
      recordLossesForB++

      competitorA.wins   = recordWinsForA
      competitorB.losses = recordLossesForB

    } else {

      recordLossesForA++
      recordWinsForB++

      competitorA.losses = recordLossesForA
      competitorB.wins   = recordWinsForB

    }

    // console.log("competitorA:",competitorA)
    // console.log("competitorB:",competitorB)

  }

  outcomeCalculator(probabilityOfVictoryForA,probabilityOfVictoryForB)

  var newRatingCalculator = function(competitor,probabilityOfVictory,numberOfVictories){

    var competitorStats = Object.keys(competitor)
    var competitorRating = competitor[competitorStats[0]]
    var competitorWins = competitor[competitorStats[1]]
    var competitorLosses = competitor[competitorStats[2]]
    var rawNewRating = competitorRating + k*(competitorWins-(probabilityOfVictory*n))
    var newRating = Math.round(rawNewRating)

    if (newRating === competitorRating && competitorRating < rawNewRating ) {

      competitor[competitorStats[0]] = newRating+1

    } else if ( newRating === competitorRating && competitorRating > rawNewRating ) {

      competitor[competitorStats[0]] = newRating-1

    } else {

      competitor[competitorStats[0]] = newRating

    }
    
    console.log("competitor:",competitor)

  }

  newRatingCalculator(competitorA,probabilityOfVictoryForA)
  newRatingCalculator(competitorB,probabilityOfVictoryForB)

}

ratingsAdjuster(competitorA,competitorB)

