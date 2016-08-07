'use strict'
var fs = require('fs');
var _  = require('lodash');

//bullPen format is =[{c1},{c2},{c3}]

// var demographicInformation = [144,306,551,642,198];
var demographicInformation = [40,40,40,40,40];
var jiujitsuBelts = ['black','brown','purple','blue','white'];
var generalPopulationArray = [];

var bullPen             = [];
var compMats = [];
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

/**
 * @name - setUpTournament
 * @description - outputs bullPen populated with integer^2 number of competitors
 * @example - bullPen = [{c1},{c2},{c3},...,{c(integer^2)}]
 *            bullPen.length = integer^2
 * @param - array
 **/

var setUpTournament = function(demographicInformation) {
  let counter = 1;
  var assembleGeneralPopulationArray = function(demographicInformation){
    //go across each item in demographicInformation array
    for ( let j = 0; j < demographicInformation.length; j++ ) {
      let tempArr = [];
      //assembles competitors
      //for as many as are in each of demographicInformation's elements
      for ( let i = 1; i <= demographicInformation[j]; i++ ) {
        let competitorNameBlueprint = counter.toString();
        let competitorBlueprint = '{"c' + competitorNameBlueprint
          + '":{"rating":1600,"wins":0,"losses":0,"record":"","beltRank":'
          + j  + ',"belt":"' + jiujitsuBelts[j] + '","matches":""}}';
        let realCompetitor = JSON.parse(competitorBlueprint);

        counter++;
        tempArr.push(realCompetitor);
      }
      generalPopulationArray.push(tempArr);
    }
  };
  assembleGeneralPopulationArray(demographicInformation);
};

/**
 * @name - variableAssigner
 * @description - Assigns to variables all statistics relevant to calculations for
 *                the two competitors on theCompetitionMats.
 * @param - theCompetitionMats
 **/
var scribe = function(theCompetitionMats){
  firstCompetitor       = theCompetitionMats[0];
  firstCompetitorName   = Object.keys(firstCompetitor)[0];
  firstCompetitorRating = firstCompetitor[firstCompetitorName]['rating'];
  firstCompetitorWins   = firstCompetitor[firstCompetitorName]['wins'];
  firstCompetitorLosses = firstCompetitor[firstCompetitorName]['losses'];
  firstCompetitorRecord = firstCompetitor[firstCompetitorName]['record'];
  firstCompetitorBelt   = firstCompetitor[firstCompetitorName]['belt'];
  firstCompetitorBeltRank = firstCompetitor[firstCompetitorName]['beltRank'];

  secondCompetitor       = theCompetitionMats[1];
  secondCompetitorName   = Object.keys(secondCompetitor)[0];
  secondCompetitorRating = secondCompetitor[secondCompetitorName]['rating'];
  secondCompetitorWins   = secondCompetitor[secondCompetitorName]['wins'];
  secondCompetitorLosses = secondCompetitor[secondCompetitorName]['losses'];
  secondCompetitorRecord = secondCompetitor[secondCompetitorName]['record'];
  secondCompetitorBelt   = secondCompetitor[secondCompetitorName]['belt'];
  secondCompetitorBeltRank = secondCompetitor[secondCompetitorName]['beltRank'];

  //important to save this step for last
  //otherwise secondCompetitorsRating may not be defined
  //at assignment-time for firstCompetitorsProbabilityOfVictory
  firstCompetitorsProbabilityOfVictory  = 1 / (1 + Math.pow(10, ((secondCompetitorRating - firstCompetitorRating) / 400)));
  secondCompetitorsProbabilityOfVictory = 1 / (1 + Math.pow(10, ((firstCompetitorRating - secondCompetitorRating) / 400)));
};

//should compare against numerical representation of belt
var biasedReferee = function(firstCompetitorBeltRank,secondCompetitorBeltRank){
  //records all their relevant information
  matchRecorder();
  //calculates winner -- highest belt always wins
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
 * @description - Determines the result of firstCompetitor's match
 *                ** ratingsAtStakeCalculator(k) -- calculates the ratings at stake for each player
 *                                                  depending on whether they win or lose
 *                Adds additional ratings points to winner
 *                Subtracts rating points from loser
 * @param - theCompetitionMats
 * @param - k-factor
 **/
var ratingsAdjuster = function(theCompetitionMats,k) {
  let firstCompetitorLastMatchResult = theCompetitionMats[0][firstCompetitorName]['record'].slice(theCompetitionMats[0][firstCompetitorName]['record'].length-1);
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
 * @description - Calculates how much each competitorObject in theCompetitionMats
 *                stands to win or lose based on the result of the match.
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
 * @description - To 'matches' key in competitorObject, assigns value -->
 *                stringified record of match just finished in theCompetitionMats.
 *                Each match is delimited by '***'
 * @example - 'matches': {'1600-c733-1600***1588-c503-1613'}
 *             where at time of match: '1600' is competitorObject's rating
 *                                     'c733' is competitorObject's opponent
 *                                     '1600' is competitorObject's opponent's rating
 *             '***' delimiter
 *             Second match:           '1588' is competitorObject's rating
 *                                     'c503' is competitorObject's opponent
 *                                     '1613' is competitorObject's opponent's rating
 * @param - none
 **/

//should record belt of opponent too
//should also record the match number in the field
//would help keep everything in place
var matchRecorder = function(){
  firstCompetitor[firstCompetitorName]['matches'] = firstCompetitor[firstCompetitorName]['matches']
                                                  + firstCompetitorRating.toString()
                                                  + "-" + secondCompetitorName
                                                  + "-" + secondCompetitorRating.toString() + "***";

  secondCompetitor[secondCompetitorName]['matches'] = secondCompetitor[secondCompetitorName]['matches']
                                                    + secondCompetitorRating.toString()
                                                    + "-" + firstCompetitorName
                                                    + "-" + firstCompetitorRating.toString() + "***";
};

/**
 * @name - mundialTournament
 * @description - Makes all competitorObjects in bullPen compete once
 *                **setUpTournament -- builds competitors; populates bullPen
 *                **roundsCalculator -- calculates the number of rounds 1st and 2nd will fight!
 *                Invokes runAllMatchesForOneRound() for numberOfRounds
 * @param - integer
 * @param - k-factor
 **/
var mundialTournament = function(demographicInformation,k){

  //step 1 & 2
  setUpTournament(demographicInformation);

  let numberOfBelts = generalPopulationArray.length
  for ( let i = 0; i < numberOfBelts; i++ ) {
    // console.log("generalPopulationArray.length:",generalPopulationArray.length);

    //loads black belts into bullPen
    bullPen.push(generalPopulationArray.shift());

    for ( let i = 0; i < generalPopulationArray.length; i++ ) {

      //takes white belts from generalPopulation and loads them into bullPen
      bullPen.push(generalPopulationArray.pop());

      //makes each black belt compete against all white belts
      for ( let i = 0; i < bullPen[0].length; i++ ) {

        //first black belt on the mats
        compMats.push(bullPen[0].shift());

        for ( let i = 0; i < bullPen[1].length; i++ ) {

          //first white belt on the mats
          compMats.push(bullPen[1].shift());

          //makes white belt compete
          scribe(compMats);
          biasedReferee(firstCompetitorBeltRank,secondCompetitorBeltRank);
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

  // console.log("finishedCompeting:",finishedCompeting);
  console.log("finishedCompeting[0][0]:",finishedCompeting[0][0]);
  console.log("finishedCompeting[1][0]:",finishedCompeting[1][0]);
  console.log("finishedCompeting[2][0]:",finishedCompeting[2][0]);
  console.log("finishedCompeting[3][0]:",finishedCompeting[3][0]);
  console.log("finishedCompeting[4][0]:",finishedCompeting[4][0]);
  // console.log("finishedCompeting[1]:",finishedCompeting[1]);
  // console.log("generalPopulationArray-->:",generalPopulationArray);
  // console.log("generalPopulationArray[0]-->:",generalPopulationArray[0]);
  // console.log("generalPopulationArray[1]-->:",generalPopulationArray[1]);
  // console.log("generalPopulationArray[2]-->:",generalPopulationArray[2]);
  // console.log("generalPopulationArray[3]-->:",generalPopulationArray[3]);
  // console.log("bullPen:",bullPen);
  // console.log("bullPen[0]:",bullPen[0]);
  // console.log("bullPen[1]:",bullPen[1]);
  // console.log("compMats:",compMats);

  //According to my black-book notes from 8/3, these are the steps.
  //
  //1.  Make competitors
  //2.  Put competitors of each belt into array
  //3.  Put firstmost beltLine (black belts) of generalPopulationArray into bullPen array
  //4.  Put lastmost beltLine (white belts) from genPopArray into bullPen
  //-Make competitors compete in a systematic fashion!-//
  //5.  Put lastmost (firstMostBeltLine)Competitor (the last black belt) into theCompetitionMatsArray
  //6.  Put lastmost (lastMostBeltLine) Competitor (the last white belt) into theCompetitionMatsArray
  //-The Competition Mat Competes!-//
  //7.  Make compMats compete!
  //8.  Return loser (white belt) to front of lastMostBeltLine (white belts)
  //9.  Recurse 6-8 until all white belts have competed -- Queue data-structure
  //9b.  compMats=[lastBBCompetitor] --> compMats.length = 1
  //-Nice to have: shuffling the white belts after they've all returned and competed-//
  //10.  Return winner (black belt) to front of firstMostBeltLine (black belts)
  //10b.  compMats=[] --> compMats.length = 0
  //11.  Recurse steps 5-10 until all firstMostBeltLine (black belts) have competed
  //11b.  with all competitors in tournament, aka gPop
  //11c.  bullPen = [blackBeltLine]; gPop=[brownBeltLine,purpleBeltLine,blueBeltLine,whiteBeltLine]
  //12.  Put firstMostBeltLine into finishedCompetingArray
  //12b.  bullPen = []; gPop=[brownBeltLine,purpleBeltLine,blueBeltLine,whiteBeltLine]
  //13.  Recurse steps 5-12 until only lastMostBeltLine remain in gPop
  //14.  Put lastMostBeltLine into finishedCompetingArray

}

// Will generate competitors equal to sum of demographicInformation which will
// Compete each belt vs each other belt
// Until a winner is declared.
// k is the maximal number of points a player can win/lose in a given match
mundialTournament(demographicInformation,8);