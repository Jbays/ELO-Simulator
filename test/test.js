'use strict';
const assert = require('assert');
const runTournament = require("../index.js")

describe('Testing runTournament', function() {
  it('Should return 2 competitors 1 round tournament', function() {
  	console.log(runTournament(1,2,20,200))
  })
  it('Should return 4 competitors 2 round tournament', function() {
  	console.log(runTournament(2,4,20,200))
  })
  it('Should return 8 competitors 3 round tournament', function() {
  	console.log(runTournament(3,8,20,200))
  })
  it('Should return 16 competitors 4 round tournament', function() {
  	console.log(runTournament(4,16,20,200))
  })
});

