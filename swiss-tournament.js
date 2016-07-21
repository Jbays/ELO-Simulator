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
//---------------------------------------------------------------------
//k-factors according to FIDE (Fédération Internationale des Échecs aka World Chess Federation):
//---------------------------------------------------------------------
//k=10 once a player has reached 2400 rating and has more than 30 games
//k=15 if a player is rated less than 2400
//k=25 until a player has at least 30 games
//---------------------------------------------------------------------
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
 *                                                      'rating':1600,'wins':0,'losses':0,'record':'','matches':''}
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
                              + '":{"rating":1600,"wins":0,"losses":0,"record":"","matches":""}}'

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
  firstCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)))

  secondCompetitor       = array[1]
  secondCompetitorName   = Object.keys(secondCompetitor)[0]
  secondCompetitorRating = secondCompetitor[secondCompetitorName]['rating']
  secondCompetitorWins   = secondCompetitor[secondCompetitorName]['wins']
  secondCompetitorLosses = secondCompetitor[secondCompetitorName]['losses']
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record']
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)))
}

/**
 * @name - matchRecorder
 * @description - To 'matches' key in competitorObject, assigns value -->
 *                stringified record of match just finished in theCompetitionMats.
 *                Each match is delimited by '***'
 *                EX: 'matches': {'1600-c733-1600***1588-c503-1613'}
 *                  where at time of match: '1600' is competitorObject's rating
 *                                          'c733' is competitorObject's opponent
 *                                          '1600' is competitorObject's opponent's rating
 *                  '***' delimiter
 *                  Second match:           '1588' is competitorObject's rating
 *                                          'c503' is competitorObject's opponent
 *                                          '1613' is competitorObject's opponent's rating
 * @param - none
 **/
var matchRecorder = function(){
  firstCompetitor[firstCompetitorName]['matches'] = firstCompetitor[firstCompetitorName]['matches']
                                                  + firstCompetitorRating.toString()
                                                  + "-" + secondCompetitorName
                                                  + "-" + secondCompetitorRating.toString() + "***"

  secondCompetitor[secondCompetitorName]['matches'] = secondCompetitor[secondCompetitorName]['matches']
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
var referee = function(probability){
  let randomNumber = Math.random()
  matchRecorder()

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

/**
 * @name - ratingsAtStakeCalculator
 * @description - Calculates how much each competitorObject in theCompetitionMats
 *                stands to win or lose in their match.
 * @param - k-factor
 **/
var ratingsAtStakeCalculator = function(k){
  ifFirstCompetitorWins   = k*(1-firstCompetitorsProbabilityOfVictory)
  ifFirstCompetitorLoses  = k*(-firstCompetitorsProbabilityOfVictory)
  ifSecondCompetitorWins  = k*(1-secondCompetitorsProbabilityOfVictory)
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
  ratingsAtStakeCalculator(k)

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

  // console.log("competitionmatDepopulator invoked!")
  // console.log("firstCompetitorRecord:",firstCompetitorRecord)
  // console.log("firstCompetitorRecord.slice(-1):",firstCompetitorRecord.slice(-1))

  if ( firstCompetitorRecord.slice(-1) === 'l' ) {
    winnersBracket.push(array.pop())
    losersBracket.push(array.pop())
  } else {
    losersBracket.push(array.pop())
    winnersBracket.push(array.pop())
  }
}

/**
 * @name - newBullPenConstructor
 * @description - Sets empty bullPen equal to winnersBracket
 *                Then adds losersBracket to new bullPen
 *                Then shuffles bullPen
 * @param - winnersBracket
 * @param - losersBracket
 **/
var newBullPenConstructor = function(winnersBracket, losersBracket){

  console.log("winnersBracket:",winnersBracket)
  console.log("losersBracket:",losersBracket)

  bullPen = winnersBracket
  let winnersLength = winnersBracket.length
  for ( let i = 0; i < winnersLength; i++ ) {
    bullPen.push(losersBracket[i])
  }
  bullPen = _.shuffle(bullPen)
}

/**
 * @name - makeAllCompetitorsCompete
 * @description - Takes as input bullPen array
 *                Makes all competitorObjects in bullPen compete once
 *                **competitorMatPopulator     -- Puts two competitorObjects into theCompetitionMats
 *                **variableAssigner           -- Gives values to all variables required for ELO-calculation
 *                **referee                    -- Declares winner and loser in theCompetitionMats
 *                **ratingsAdjuster            -- Adjusts both winner's and loser's rating
 *                **competitionMatsDepopulator -- Empties theCompetitionMats
 * @param - bullPen
 **/
var makeAllCompetitorsCompete = function(array){
  var numberOfMatches = array.length/2
  for ( let i = 0; i < numberOfMatches; i++ ) {
    competitionMatPopulator(bullPen)
    variableAssigner(theCompetitionMat)
    referee(theCompetitionMat, firstCompetitorsProbabilityOfVictory)
    ratingsAdjuster(theCompetitionMat)
    competitionMatDepopulator(theCompetitionMat)
  }
}

/**
 * @name - swissTournament
 * @description - Takes as input number of rounds competitors are obliged to compete
 *                **bullPenGenerator -- Creates competitors; Adds them to bullPen array
 *                For desired number of rounds, competitors will compete
 *                  **makeAllCompetitorsCompete -- Forces all competitors to compete once; Empties bullPen array
 *                  **newBullPenConstructor     -- Repopulates bullPen with winnersBracket and losersBracket
 *                  Then empties both winnersBracket and losersBracket
 * @param - Number of Rounds competitors will compete
 **/
var swissTournament = function(numberOfRoundsDesired){
  bullPenGenerator(competitorsSquared)
  for ( let i = 0; i < numberOfRoundsDesired; i++ ) {
    makeAllCompetitorsCompete(bullPen)
    newBullPenConstructor(winnersBracket,losersBracket)
    winnersBracket = []
    losersBracket  = []
  }
  // console.log("from swissTournament --> bullPen:",bullPen)
}

swissTournament(4)