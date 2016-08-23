'use strict'
var fs = require('fs');
var _  = require('lodash');

/*********************************
 ** BEGIN VARIABLE DECLARATIONS **
 *********************************/

// for the Mundials 2015 -- 1861 competitors
var demographicInformation = null;
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

var allCompetitorRatings = [];
var allCompetitorNames  = [];
var averagesArr  = [];
var distancesArr = [];
var totalCompetitors = null;

var varianceArray = [];
var standDevArray = [];

/*********************************
 *** END VARIABLE DECLARATIONS ***
 *********************************/

/*******************************
 * BEGIN MATHEMATICAL FUNCTIONS *
 *******************************/

//Mathematical functions
var calculateRange = function(beltLineRatingsArray){
  let min = Math.min.apply(null,beltLineRatingsArray);
  let max = Math.max.apply(null,beltLineRatingsArray);
  let diff = max-min;

  return [min,max,diff]
};

var calculateAverage = function(beltLineRatingsArray){
  let sum = beltLineRatingsArray.reduce((prev, curr) => prev + curr);
  let roundedAvg = Math.round(sum/beltLineRatingsArray.length);
  averagesArr.push(roundedAvg);

  return roundedAvg;
};

var calculateDistanceBetweenBelts = function(averagesArr){
  //don't need to start at i=0, because averagesArr[i-1] is NaN
  for ( let i = 1; i < averagesArr.length; i++ ) {
    let diff = averagesArr[i-1]-averagesArr[i];
    distancesArr.push(diff);
  }
};

var calculateVariance = function(averagesArr, allCompetitorRatings){
  //for each average in averagesArr
  for ( let i = 0; i < averagesArr.length; i++ ) {
    let tempArr = [];
    let average = averagesArr[i];
    let wholeBeltLine = allCompetitorRatings[i];
    let numberOfBelts = wholeBeltLine.length;

    //for each competitor rating in competitorRating
    for ( let j = 0; j < numberOfBelts; j++ ) {
      let individualCompetitorRating = wholeBeltLine[j];
      let deviations = Math.pow(average-individualCompetitorRating,2);
      tempArr.push(deviations);
    }
    let tempArrVariance = tempArr.reduce((prev,curr) => prev+curr)/numberOfBelts;
    varianceArray.push(tempArrVariance);
  }
};

var calculateStandardDeviation = function(varianceArray){
  for ( let i = 0; i < varianceArray.length; i++ ) {
    standDevArray.push(Math.sqrt(varianceArray[i]));
  }
};

/*******************************
 * END MATHEMATICAL FUNCTIONS *
 *******************************/

/************************************
 **** BEGIN TOURNAMENT FUNCTIONS ****
 ************************************/

/**
 * @name - generateDemographicInformation
 * @description - Scales competitors according to calculated ratio between beltLines in Mundials 2015
 * @example - generalPopulationArray = [
 **             [blackBeltLine],[brownBeltLine],[purpleBeltLine],[blueBeltLine],[whiteBeltLine]
 **           ]
 * @param - integer
 **/
var generateDemographicInformation = function(integer){
  let twentyFiveCompetitors = [2,4,7,9,3];

  demographicInformation = twentyFiveCompetitors.map(function(competitorsPerBelt){
    return competitorsPerBelt*integer;
  });
}

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
    let tempArr  = [];
    let listOfCompetitorNames = [];

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

      //take competitor's fullName and pushes into listOfCompetitorNames
      let competitorFullName = "c"+competitorNameBlueprint;
      listOfCompetitorNames.push(competitorFullName);
    }
    //pushes all listOfCompetitorNames into holding array
    allCompetitorNames.push(listOfCompetitorNames);
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
 **  To 'matches' key in competitor, assigns value -->
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
 * @name - mundialTournamentPrintouts
 * @description - logs to the console parts of the arrays of interest for mundialTournament()
 **  first set of console.logs prints out each beltLine in finishedCompeting array
 **  REST OF console.logs SHOULD PRINT EMPTY!
 **  second set prints out each beltLine in generalPopulationArray
 **  third prints bullPen array
 **  fourth prints compMats
 * @param - none
 **/

var mundialTournamentPrintouts = function(){
  //first black belt
  console.log("finishedCompeting[0][0]:",finishedCompeting[0][0]);
  //first brown belt
  console.log("finishedCompeting[1][0]:",finishedCompeting[1][0]);
  //first purple belt
  console.log("finishedCompeting[2][0]:",finishedCompeting[2][0]);
  //first blue belt
  console.log("finishedCompeting[3][0]:",finishedCompeting[3][0]);
  //first white belt
  console.log("finishedCompeting[4][0]:",finishedCompeting[4][0]);

  //generalPopulationArray -- should be empty
  // console.log("generalPopulationArray-->:",generalPopulationArray);
  // console.log("generalPopulationArray[0]-->:",generalPopulationArray[0]);
  // console.log("generalPopulationArray[1]-->:",generalPopulationArray[1]);
  // console.log("generalPopulationArray[2]-->:",generalPopulationArray[2]);
  // console.log("generalPopulationArray[3]-->:",generalPopulationArray[3]);

  // console.log("bullPen:",bullPen);
  // console.log("bullPen[0]:",bullPen[0]);
  // console.log("bullPen[1]:",bullPen[1]);

  // console.log("compMats:",compMats);
};

/**
 * @name - mundialTournament
 * @description - Makes all competitors in generalPopulationArray compete
 * @param - demographicInformation (array)
 * @param - k-factor (integer)
 **/
var mundialTournament = function(integer,k){

  //populates demographicInformation array with competitors
  //proportional to the mundialTournament.js
  generateDemographicInformation(integer);

  //generates competitors
  //separates competitors by belt
  //Enters all into generalPopulationArray
  assembleGeneralPopulationArray(demographicInformation);

  let numberOfDifferentBelts = generalPopulationArray.length;

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

  // this function'll print out all arrays for mundialTournament
  // mundialTournamentPrintouts();
};

/**********************************
 **** END TOURNAMENT FUNCTIONS ****
 **********************************/

/*********************************
 *** BEGIN PRINTOUTS FUNCTIONS ***
 *********************************/

/**
 * @name - printoutStatistics
 * @description - for each beltLine --> logs to the console
 **  (1) # of competitors
 **  (2) average rating of a given beltLine
 **  (3) lowest rating in a given beltLine
 **  (4) highest rating in a given beltLine
 **  (5) range
 * @param - none
 **/
var printoutStatistics = function() {
  console.log("........................................");
  // console.log("all competitor Ratings in a nested array:",allCompetitorRatings);
  console.log("total competitors in tournament -->",totalCompetitors);

  let printBlackBeltStats = function() {
    console.log("..........black..belt.stats..........");
    console.log("# of black belts-->",allCompetitorRatings[0].length);
    console.log("average black belt rating:",calculateAverage(allCompetitorRatings[0]));
    // console.log("all black belts ratings-->",allCompetitorRatings[0]);
    console.log("lowest black belt rating:",calculateRange(allCompetitorRatings[0])[0]);
    console.log("highest black belt rating:",calculateRange(allCompetitorRatings[0])[1]);
    console.log("range:",calculateRange(allCompetitorRatings[0])[2]);
  };

  let printBrownBeltStats = function() {
    console.log("..........brown..belt.stats..........");
    console.log("# of brown belts-->",allCompetitorRatings[1].length);
    console.log("average brown belt rating:",calculateAverage(allCompetitorRatings[1]));
    // console.log("all brown belt ratings",allCompetitorRatings[1]);
    console.log("lowest brown belt rating:",calculateRange(allCompetitorRatings[1])[0]);
    console.log("highest brown belt rating:",calculateRange(allCompetitorRatings[1])[1]);
    console.log("range:",calculateRange(allCompetitorRatings[1])[2]);
  };

  let printPurpleBeltStats = function() {
    console.log("..........purple.belt.stats..........");
    console.log("# of purple belts-->",allCompetitorRatings[2].length);
    console.log("average purple belt rating:",calculateAverage(allCompetitorRatings[2]));
    // console.log("all purple belt ratings",allCompetitorRatings[2]);
    console.log("lowest purple belt rating:",calculateRange(allCompetitorRatings[2])[0]);
    console.log("highest purple belt rating:",calculateRange(allCompetitorRatings[2])[1]);
    console.log("range:",calculateRange(allCompetitorRatings[2])[2]);
  };

  let printBlueBeltStats = function() {
    console.log("..........blue...belt.stats..........");
    console.log("# of blue belts-->",allCompetitorRatings[3].length);
    console.log("average blue belt rating:",calculateAverage(allCompetitorRatings[3]));
    // console.log("all blue belt ratings-->",allCompetitorRatings[3]);
    console.log("lowest blue belt rating:",calculateRange(allCompetitorRatings[3])[0]);
    console.log("highest blue belt rating:",calculateRange(allCompetitorRatings[3])[1]);
    console.log("range:",calculateRange(allCompetitorRatings[3])[2]);
  };

  let printWhiteBeltStats = function() {
    console.log("..........white..belt.stats..........");
    console.log("# of white belts-->",allCompetitorRatings[4].length);
    console.log("average white belt rating:",calculateAverage(allCompetitorRatings[4]));
    // console.log("all white belt ratings-->",allCompetitorRatings[4]);
    console.log("lowest white belt rating:",calculateRange(allCompetitorRatings[4])[0]);
    console.log("highest white belt rating:",calculateRange(allCompetitorRatings[4])[1]);
    console.log("range:",calculateRange(allCompetitorRatings[4])[2]);
  };

  printBlackBeltStats();
  printBrownBeltStats();
  printPurpleBeltStats();
  printBlueBeltStats();
  printWhiteBeltStats();

  console.log("........................................");
  calculateDistanceBetweenBelts(averagesArr);
  console.log("distance between average belt rating");
  console.log('between black and brown:',distancesArr[0]);
  console.log('between brown and purple:',distancesArr[1]);
  console.log('between purple and blue:',distancesArr[2]);
  console.log('between blue and white:',distancesArr[3]);
  console.log("........................................");

  calculateVariance(averagesArr,allCompetitorRatings);
  // console.log("varianceArray:",varianceArray)

  calculateStandardDeviation(varianceArray);
  console.log("Standard Deviations (SD) for Belts:");
  console.log("black belt SD:",standDevArray[0]);
  console.log("brown belt SD:",standDevArray[1]);
  console.log("purple belt SD:",standDevArray[2]);
  console.log("blue belt SD:",standDevArray[3]);
  console.log("white belt SD:",standDevArray[4]);
  console.log("........................................");
};

// this function needs to be refactored
// the central question is -- why is the reporter function dynamically nesting competitor ratings?
// no good answer.
var reporter = function(finishedCompeting, demographicInformation, allCompetitorNames){
  // dynamically nest competitor rating according to their rank
  // access each name in allCompetitorNames
  for ( let i = 0; i < allCompetitorNames.length; i++ ) {
    let numberOfCompetitors = demographicInformation[i];
    let tempArr = [];

    //iterating on each competitor
    for ( let j = 0; j < numberOfCompetitors; j++ ) {
      let competitor = finishedCompeting[i][j][allCompetitorNames[i][j]];
      tempArr.push(competitor.rating)
    }
    allCompetitorRatings.push(tempArr);
  }

  totalCompetitors = allCompetitorRatings[0].length + allCompetitorRatings[1].length
                   + allCompetitorRatings[2].length + allCompetitorRatings[3].length
                   + allCompetitorRatings[4].length;

  printoutStatistics();
};

/*********************************
 **** END PRINTOUTS FUNCTIONS ****
 *********************************/

/********************************
 ****** BEGIN TRIGGER-PULL ******
 ********************************/

// Will generate competitors equal to sum of demographicInformation which will
// Compete each belt vs each other belt
// Until a winner is declared.
// k is the maximal number of points a player can win/lose in a given match
// mundialTournament(demographicInformation,25);
mundialTournament(1,25);

// The next step is to write a function that'll run mundialTournament
// while incrementing K and recording the simple automated reports.
// if any values for k match my expected outcome, hone in your search!
// Then run the tournament with that selected k value and see
// if the tournament will follow approximately the same results
// as mundialTournament.js with the biasedReferee()!
// ^^The Ultimate Sanity Check^^
reporter(finishedCompeting, demographicInformation, allCompetitorNames);

/********************************
 ******* END TRIGGER-PULL *******
 ********************************/