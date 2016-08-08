'use strict'
var fs = require('fs');
var _  = require('lodash');

//for the Mundials 2015
//var demographicInformation = [144,306,551,642,198];
var demographicInformation = [2,2,2,2,2];
var jiujitsuBelts = ['black','brown','purple','blue','white'];
var beltAbbreviations = ['b','br','p','u','w'];
var generalPopulationArray = [];

var bullPen             = [];
var compMats            = [];
var finishedCompeting   = [];
var firstCompetitorsProbabilityOfVictory  = 0;
var secondCompetitorsProbabilityOfVictory = 0;

var firstCompetitor       = null;
var firstCompetitorLosses = 0;
var firstCompetitorName   = null;
var firstCompetitorRating = null;
var firstCompetitorRecord = null;
var firstCompetitorWins   = 0;
var firstCompetitorBelt   = null;
var firstCompetitorBeltRank = null;

var secondCompetitor       = null;
var secondCompetitorName   = null;
var secondCompetitorWins   = 0;
var secondCompetitorLosses = 0;
var secondCompetitorRating = null;
var secondCompetitorRecord = null;
var secondCompetitorBelt   = null;
var secondCompetitorBeltRank = null;

var ifFirstCompetitorWins   = null;
var ifFirstCompetitorLoses  = null;
var ifSecondCompetitorWins  = null;
var ifSecondCompetitorLoses = null;

var firstCompetitorsTotalMatches = null;
var secondCompetitorsTotalMatches = null;



/**
 * @name - assembleGeneralPopulationArray
 * @description - populates generalPopulationArray with competitors
 **               who are separated by belt.
 * @example - generalPopulationArray = [
 **             [blackBeltLine],[brownBeltLine],[purpleBeltLine],[blueBeltLine],[whiteBeltLine]
 **           ]
 * @param - demographicInformation (array with five values)
 **/
var assembleGeneralPopulationArray = function(demographicInformation){
  //this is for the competitor's name
  let counter = 1;

  //for each belt demographic in demographicInformation array
  for ( let j = 0; j < demographicInformation.length; j++ ) {
    //empty beltLine
    let tempArr = [];

    //for each belt in a single belt demographic
    for ( let i = 1; i <= demographicInformation[j]; i++ ) {
      //competitor's name
      let competitorNameBlueprint = counter.toString();
      //string of competitors statistical information
      let competitorBlueprint = '{"c' + competitorNameBlueprint
                              + '":{"belt":"' + jiujitsuBelts[j]
                              + '","rating":1600,"wins":0,"losses":0,"beltRank":' + j
                              + ',"record":"","matches":""}}';
      //parses string into JSON
      let realLifeCompetitor = JSON.parse(competitorBlueprint);
      //push realLifeCompetitor into beltLine
      tempArr.push(realLifeCompetitor);
      //increment name
      counter++;
    }
    //pushes beltLine into generalPopulationArray
    generalPopulationArray.push(tempArr);
  }
};

/**
 * @name - scribe
 * @description - Assigns all variables required for the two competitors on compMats.
 * @param - compMat
 **/
var scribe = function(compMat){
  firstCompetitor       = compMat[0];
  firstCompetitorName   = Object.keys(firstCompetitor)[0];
  firstCompetitorRating = firstCompetitor[firstCompetitorName]['rating'];
  firstCompetitorWins   = firstCompetitor[firstCompetitorName]['wins'];
  firstCompetitorLosses = firstCompetitor[firstCompetitorName]['losses'];
  firstCompetitorRecord = firstCompetitor[firstCompetitorName]['record'];
  firstCompetitorBelt   = firstCompetitor[firstCompetitorName]['belt'];
  firstCompetitorBeltRank = firstCompetitor[firstCompetitorName]['beltRank'];
  firstCompetitorsTotalMatches = firstCompetitorWins + firstCompetitorLosses+1;

  secondCompetitor       = compMat[1];
  secondCompetitorName   = Object.keys(secondCompetitor)[0];
  secondCompetitorRating = secondCompetitor[secondCompetitorName]['rating'];
  secondCompetitorWins   = secondCompetitor[secondCompetitorName]['wins'];
  secondCompetitorLosses = secondCompetitor[secondCompetitorName]['losses'];
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record'];
  secondCompetitorBelt   = secondCompetitor[secondCompetitorName]['belt'];
  secondCompetitorBeltRank = secondCompetitor[secondCompetitorName]['beltRank'];
  secondCompetitorsTotalMatches = secondCompetitorWins + secondCompetitorLosses+1;

  //important to save this step for last
  //otherwise secondCompetitorsRating may not be defined
  //at assignment-time for firstCompetitorsProbabilityOfVictory
  firstCompetitorsProbabilityOfVictory  = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)));
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)));
};

/**
 * @name - biasedReferee
 * @description - Calculates winner && loser of match based on beltRank
 **               The highest belt always wins
 **               **matchRecorder**
 **               Wins/loss and record are modified for both competitors
 * @param - compMat
 * @param - k-factor
 **/

//should compare against numerical representation of belt
var biasedReferee = function(){
  //writes to each competitor's 'matches' key
  matchRecorder();

  //calculates winner
  if ( firstCompetitorBeltRank < secondCompetitorBeltRank ) {
    firstCompetitor[firstCompetitorName]['wins']++;
    firstCompetitor[firstCompetitorName]['record'] = firstCompetitorRecord + "w";

    secondCompetitor[secondCompetitorName]['losses']++;
    secondCompetitor[secondCompetitorName]['record'] = secondCompetitorRecord + "l";
  } else {
    firstCompetitor[firstCompetitorName]['losses']++;
    firstCompetitor[firstCompetitorName]['record'] = firstCompetitorRecord + "l";

    secondCompetitor[secondCompetitorName]['wins']++;
    secondCompetitor[secondCompetitorName]['record'] = secondCompetitorRecord + "w";
  }
};

/**
 * @name - ratingsAdjuster
 * @description - Looks up result of firstCompetitor's match
 **               **ratingsAtStakeCalculator(k)**
 **               Adds additional ratings points to winner
 **               Subtracts rating points from loser
 * @param - compMat
 * @param - k-factor
 **/
var ratingsAdjuster = function(compMat,k) {
  let firstCompetitorLastMatchResult = compMat[0][firstCompetitorName]['record'].slice(compMat[0][firstCompetitorName]['record'].length-1);
  ratingsAtStakeCalculator(k);

  if ( firstCompetitorLastMatchResult === 'w' ) {
    firstCompetitor[firstCompetitorName]['rating']   = Math.round(firstCompetitorRating + ifFirstCompetitorWins);
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorLoses);
  } else {
    firstCompetitor[firstCompetitorName]['rating']   = Math.round(firstCompetitorRating + ifFirstCompetitorLoses);
    secondCompetitor[secondCompetitorName]['rating'] = Math.round(secondCompetitorRating + ifSecondCompetitorWins);
  }
  firstCompetitorRecord  = firstCompetitor[firstCompetitorName]['record'];
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record'];
};

/**
 * @name - ratingsAtStakeCalculator
 * @description - Calculates how much many rating points each competitor wins/loses
 **               based on match result
 * @param - k-factor
 **/
var ratingsAtStakeCalculator = function(k){
  ifFirstCompetitorWins   = k*(1-firstCompetitorsProbabilityOfVictory);
  ifFirstCompetitorLoses  = k*(-firstCompetitorsProbabilityOfVictory);
  ifSecondCompetitorWins  = k*(1-secondCompetitorsProbabilityOfVictory);
  ifSecondCompetitorLoses = k*(-secondCompetitorsProbabilityOfVictory);
};

/**
 * @name - matchRecorder
 * @description - Writes record of a competitor's match
 * To 'matches' key in competitor, assigns value -->
 **                stringified record of match just finished in compMat.
 **                Each match is delimited by '***'
 * @example - 'matches': {'1-1600-c9-w-1600***2-1588-c8-u-1613***'}
 **            where at time of match:
 **              1 is their match number
 **              1600 is competitor's rating
 **              c9 is their opponent's name
 **              w is their opponent's belt (white)
 **              1600 is their opponent's rating
 **            '***' delimiter
 **            Second example:
 **              2 is their match number
 **              1588 is competitor's rating
 **              c8 is their opponent's name
 **              u is their opponent's belt (blue)
 **              1613 is their opponent's rating
 * @param - none
 **/

//should record belt of opponent too
//should also record the match number in the field
//would help keep everything in place
var matchRecorder = function(){
  firstCompetitor[firstCompetitorName]['matches'] = firstCompetitor[firstCompetitorName]['matches']
                                                  + firstCompetitorsTotalMatches.toString() + "-"
                                                  + firstCompetitorRating.toString()
                                                  + "-" + secondCompetitorName
                                                  + "-" + beltAbbreviations[secondCompetitorBeltRank]
                                                  + "-" + secondCompetitorRating.toString() + "***";

  secondCompetitor[secondCompetitorName]['matches'] = secondCompetitor[secondCompetitorName]['matches']
                                                    + secondCompetitorsTotalMatches.toString() + "-"
                                                    + secondCompetitorRating.toString()
                                                    + "-" + firstCompetitorName
                                                    + "-" + beltAbbreviations[firstCompetitorBeltRank]
                                                    + "-" + firstCompetitorRating.toString() + "***";
};

/**
 * @name - mundialTournament
 * @description - Makes all competitorObjects in generalPopulationArray compete
 *
 *                **setUpTournament -- builds competitors; populates bullPen
 *                **roundsCalculator -- calculates the number of rounds 1st and 2nd will fight!
 *                Invokes runAllMatchesForOneRound() for numberOfRounds
 * @param - demographicInformation (array)
 * @param - k-factor (integer)
 **/
var mundialTournament = function(demographicInformation,k){

  //generates competitors
  //separates competitors by belt
  //Enters all into generalPopulationArray
  assembleGeneralPopulationArray(demographicInformation);

  let numberOfDifferentBelts = generalPopulationArray.length

  //for each beltLine
  for ( let i = 0; i < numberOfDifferentBelts; i++ ) {
    //loads blackBeltLine into bullPen
    bullPen.push(generalPopulationArray.shift());

    //for each of the remainder of generalPopulationArray
    for ( let i = 0; i < generalPopulationArray.length; i++ ) {
      //loads whiteBeltLine into bullPen
      bullPen.push(generalPopulationArray.pop());

      //for each black belt in blackBeltLine
      for ( let i = 0; i < bullPen[0].length; i++ ) {
        //first black belt on the mats
        compMats.push(bullPen[0].shift());

        //for each white belt
        for ( let i = 0; i < bullPen[1].length; i++ ) {

          //first white belt on compMats
          compMats.push(bullPen[1].shift());

          //makes black belt compete against white belt
          scribe(compMats);
          biasedReferee();
          ratingsAdjuster(compMats,k);

          //puts white belt back into bullPen
          bullPen[1].push(compMats.pop());
        }
        //returns black belt to his beltLine
        bullPen[0].push(compMats.pop());
      }
      // puts white belts back into generalPopulation
      generalPopulationArray.unshift(bullPen.pop());
    }
    //put black belts into finishedCompeting array
    finishedCompeting.push(bullPen.pop());
  }

  console.log("finishedCompeting:",finishedCompeting);
  console.log("finishedCompeting[0][0]:",finishedCompeting[0][0]);
  console.log("finishedCompeting[1][0]:",finishedCompeting[1][0]);
  console.log("finishedCompeting[2][0]:",finishedCompeting[2][0]);
  console.log("finishedCompeting[3][0]:",finishedCompeting[3][0]);
  console.log("finishedCompeting[4][0]:",finishedCompeting[4][0]);
  console.log("generalPopulationArray-->:",generalPopulationArray);
  // console.log("generalPopulationArray[0]-->:",generalPopulationArray[0]);
  // console.log("generalPopulationArray[1]-->:",generalPopulationArray[1]);
  // console.log("generalPopulationArray[2]-->:",generalPopulationArray[2]);
  // console.log("generalPopulationArray[3]-->:",generalPopulationArray[3]);
  console.log("bullPen:",bullPen);
  // console.log("bullPen[0]:",bullPen[0]);
  // console.log("bullPen[1]:",bullPen[1]);
  console.log("compMats:",compMats);
}

// Will generate competitors equal to sum of demographicInformation which will
// Compete each belt vs each other belt
// Until a winner is declared.
// k is the maximal number of points a player can win/lose in a given match
mundialTournament(demographicInformation,8);

