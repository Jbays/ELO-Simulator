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

  console.log("competitorA.rating:",competitorA.rating)
  console.log("competitorB.rating:",competitorB.rating)



}

ratingsAdjuster(competitorA,competitorB)


