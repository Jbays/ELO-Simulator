/**
 * @name: generateCompetitors
 * @description: creates "n" number of com
 * @param: numOfCompetitors (integer) - the total amount of competitors in a tournament
 * @returns: allCompetitors
 **/
function generateCompetitors(numOfCompetitors){
	return numOfCompetitors
}


/**
 * @name: runTournament
 * @description: Calculates the elo rating of bjj competitors after a tournament
 * @param: roundNum (integer) - the amount of tournament rounds for each bjj competitor
 * @param: tournSize (integer) - the amount of bjj competitors
 * @returns: results of tournament
 **/
function runTournament(roundNum,tournSize){
	console.log("runTournament invoked!");


	console.log("running a tournament of !!!",roundNum,"rounds !!!")
	console.log("and                     !!!",tournSize,"competitors !!!")

	allCompetitors = generateCompetitors(roundNum)

	console.log("these are our competitors>>>>",allCompetitors)

	//creator competitors

	//make them compete

	//afterward I'll have some interesting choices:

	//Choices:
	//1. save competitors to db then run competition again

	//2. or make basic ui?

	


	// return ...what?

}

//the simplest tournament is two rounds, four competitors
runTournament(2,4)

