'use strict';
/*global describe, beforeEach, it*/
var assert = require("assert")
  , Match = require('../lib/match').Match;

describe('Match event handler', function () {
  var match;
  beforeEach(function () {
    match = new Match();
  });

  describe('for ss_tournament_match_start', function () {
    var event = {
      name: 'ss_tournament_match_start'
    , timestamp: 5000
    , data: {
        hostname: 'Team Fortress'
      , mapname: 'cp_badlands'
      , bluname: 'BLU'
      , redname: 'RED'
      }
    };
    it('should handle the event', function () {
      match.handleEvent(event);
      assert.equal(match.hostname, 'Team Fortress');
      assert.equal(match.mapname, 'cp_badlands');
      assert.equal(match.bluname, 'BLU');
      assert.equal(match.redname, 'RED');
    });
  });
});
