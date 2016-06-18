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

var ratingsAdjuster = function(competitorA,competitorB){

  var competitorARating = competitorA.rating
  var competitorBRating = competitorB.rating

  var probabilityOfVictoryForA = 1 / (1 + Math.pow(10,((competitorBRating-competitorARating)/400)))
  var probabilityOfVictoryForB = 1 / (1 + Math.pow(10,((competitorARating-competitorBRating)/400)))

  console.log("probabilityOfVictoryForA:",probabilityOfVictoryForA)
  console.log("probabilityOfVictoryForB:",probabilityOfVictoryForB)


}

ratingsAdjuster(competitorA,competitorB)


