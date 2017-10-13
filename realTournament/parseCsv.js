const records = `,,,
  ,EDDIE BRAVO INVITATIONAL 2,,
  ,"October 10, 2014",,
  ,,,
  ,,,
  ,135,NAME,ACADEMY
  ,1,Geo Martinez,10th Planet San Diego
  ,2,Javier Cardenas,Paragon Santa Maria
  ,3,Julian Medrano,Camarillo Jiu Jitsu
  ,4,Kerry Phan,10th Planet Costa Mesa/Buena Park
  ,5,Kristian Woodmansee,Atos
  ,6,Richard Alarcon,Lotus Club
  ,7,Randall Dolf,10th Planet Riverside
  ,8,Sean Najjar,Baret Submissions
  ,9,Alexander Condos,Marcelo Garcia Academy
  ,10,Alexis Alduncin,Renzo Gracie Mexico
  ,11,Alex Canders,10th Planet San Francisco
  ,12,Geoff Real,Victory MMA
  ,13,Rene Lopez,Zenith BJJ
  ,14,Eric Medina,Jean Jacques Machado Academy
  ,15,Matt Betzold,Ultimate Fitness/Team Alpha Male
  ,16,Fabio Passos,Cobrinha Brazilian Jiu Jitsu
  ,,,
  ,155,NAME,ACADEMY
  ,1,Denny Prokopos,10th Planet San Francisco
  ,2,Rich Chavez,Judgement MMA and Fitness
  ,3,Eddie Fyvie,Spa City Jiu-Jitsu
  ,4,Ben Jimenez,Cobrinha Brazilian Jiu Jitsu
  ,5,Russ Miura,Subfighter
  ,6,Matthew Kaiser,Fierce Studio Martial Arts
  ,7,Jeremy Fields,10th Planet Corona
  ,8,Pete Fabela,Paragon Santa Maria
  ,9,Nathan Orchard,10th Planet Portland
  ,10,PJ Lindner,Xtreme Couture
  ,11,Dane Molina,5 Star Martial Arts/Renzo Gracie LA
  ,12,Joe Murphy,Cleber Jiu Jitsu
  ,13,Rafael Domingos,Zenith BJJ
  ,14,Juan Bernardo,Victory MMA
  ,15,Adam Morrison,Fight Strong
  ,16,Baret Yoshida,Baret Submissions
`;

const _ = require('underscore');
const csvParse = require('csv-parse');
const dataObj = csvParse(records);

/**
 * @name: cleanUpObj
 * @description: removes irrelevant keys from stringifiedCsv
 * @param: stringifiedCsv (obj)
 * @returns: output (obj)
 **/
function cleanUpObj(obj){
  let output = {};
  Object.keys(obj).forEach((key)=>{
    let numberized = Number(key)
    if ( !Number.isNaN(numberized) ) {
      output[key] = obj[key];
    }
  })

  const zip = _.zip(Object.keys(output),_.values(output));

  let everyCompetitor = [];
  let min = 0;
  let max = null;
  zip.forEach((nestedArr)=>{
    if ( nestedArr[1] === '\n' ) {
      max = Number(nestedArr[0])+1;
      everyCompetitor.push(zip.slice(min,max));
      //this should reset the slicing mechanism logic
      min = max;
      max = null;
    }
  })

  let outputArr = [];
  everyCompetitor.forEach((internalArr)=>{
    let str = '';
    internalArr.forEach((letter)=>{
      if (!!letter[1]){
        str = str+letter[1];
      }
    })
    outputArr.push(str);
  })

  //removing the annoying characters
  outputArr = _.without(outputArr,",,,\n","  ,,,\n")
  outputArr.shift()
  outputArr.shift()

  let newArr = outputArr.map((string)=>{
    //removes the '  ,' at the string's beginning
    string = string.slice(3);
    //removes the '\n' at the string's end
    return string.slice(0,string.length-1);
  })

  newArr = [newArr.slice(0,17),newArr.slice(17,newArr.length)]

  return newArr;
}

function buildCompetitors(arr){
  let output = [];
  arr.forEach((weightClass)=>{
    let bracket = weightClass.shift();
    bracket = bracket.split(',');
    //NOTE: bracket = [ '135', 'NAME', 'ACADEMY' ]

    weightClass.forEach((nameString)=>{
      //formatting the name
      nameString = nameString.split(',');

      //NOTE: notice that ln 120-146 contain two identical steps.  Refactor?!
      ///////////////////////////
      let formattedName = '';
      const fullName = nameString[1];

      for ( let i = 0; i < fullName.length; i++ ) {
        //if fullName[i] is truthy && fullName[i] is not an empty space
        if (!!fullName[i] ) {
          if ( fullName[i] !== ' ' ) {
            formattedName = formattedName + fullName[i].toLowerCase();
          } else {
            formattedName = formattedName + "-";
          }
        }
      }
      let formattedTeamName = '';
      const fullTeamName = nameString[2];

      for ( let i = 0; i < fullTeamName.length; i++ ) {
        //if fullTeamName[i] is truthy && fullTeamName[i] is not an empty space
        if (!!fullTeamName[i] ) {
          if ( fullTeamName[i] !== ' ' ) {
            formattedTeamName = formattedTeamName + fullTeamName[i].toLowerCase();
          } else {
            formattedTeamName = formattedTeamName + "-";
          }
        }
      }
      ///////////////////////////

      //NOTE: create competitor here!
      let competitor = {
        name: formattedName,
        teamName: formattedTeamName,
        bracket: parseInt(bracket[0]),
        rating: 1600,
        wins:0,
        losses:0,
        streak:'',
        compRecord: ''
      }

      output.push(competitor)
    })
  })
  return output;
}

const sanitizedArr = cleanUpObj(dataObj.options);
const allCompetitors = buildCompetitors(sanitizedArr);


module.exports = allCompetitors
