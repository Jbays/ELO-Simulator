/**
 * Created by justin.baize on 6/16/16.
 */
var fs = require('fs');
var _  = require('lodash');

var competitorA = {
  rating: 1600,
  wins: 0,
  losses: 0
}

var competitorB = {
  rating: 1800,
  wins:   0,
  losses: 0
}

var ratingsAdjuster = function(competitorA,competitorB) {

  var competitorARating = competitorA.rating
  var competitorBRating = competitorB.rating
  var recordWinsForA   = competitorA.wins
  var recordWinsForB   = competitorB.wins
  var recordLossesForA = competitorA.losses
  var recordLossesForB = competitorB.losses

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

    console.log("competitorA:",competitorA)
    console.log("competitorB:",competitorB)

  }

  outcomeCalculator(probabilityOfVictoryForA,probabilityOfVictoryForB)
  var newRatingCalculator = function(competitor,probabilityOfVictory,numberOfVictories){

    var competitorStats = Object.keys(competitor)

    console.log("competitorStats:",competitorStats)

  }

  newRatingCalculator(competitorA,probabilityOfVictoryForA)
  newRatingCalculator(competitorA,probabilityOfVictoryForB)

}

ratingsAdjuster(competitorA,competitorB)

