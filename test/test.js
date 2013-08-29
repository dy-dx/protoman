'use strict';
/*global describe, beforeEach, it*/
var assert = require("assert")
  , Match = require('../lib/match').Match;

// don't know where this belongs
var buildPlayer = function (match, playerData) {
  match.addPlayer(playerData);
};

var sizzlingPlayerData = {
  name: 'SizzlingCalamari'
, userid: 2
, entindex: 1
, steamid: 'STEAM_0:0:14353663'
, teamid: 3
, netaddr: '192.168.1.200:27006'
, isstv: false
, isbot: false
, isreplay: false
};

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

  describe('for ss_player_info', function () {
    var event = {
      name: 'ss_player_info'
    , timestamp: 5000
    , data: {
        name: 'SizzlingCalamari'
      , userid: 2
      , entindex: 1
      , steamid: 'STEAM_0:0:14353663'
      , teamid: 3
      , netaddr: '192.168.1.200:27006'
      , isstv: false
      , isbot: false
      , isreplay: false
      }
    };
    it('should handle the event', function () {
      match.handleEvent(event);
      var player = match.getPlayer(2);
      assert.equal(player.getValue('name'), 'SizzlingCalamari');
      assert.equal(player.getValue('userid'), 2);
      assert.equal(player.getValue('entindex'), 1);
      assert.equal(player.getValue('steamid'), 'STEAM_0:0:14353663');
      assert.equal(player.getValue('team'), 3);
      assert.equal(player.getValue('address'), '192.168.1.200:27006');
      assert.equal(player.getValue('isStv'), false);
      assert.equal(player.getValue('isBot'), false);
      assert.equal(player.getValue('isReplay'), false);
      assert.equal(player.getValue('team'), 3);
    });
  });

  describe('for player_connect', function () {
    var event = {
      name: 'player_connect'
    , timestamp: 5000
    , data: {
        name: 'SizzlingCalamari'
      , index: 1
      , userid: 3
      , networkid: 'STEAM_0:0:14353663'
      , address: '173.242.129.118:27005'
      , bot: 0
      }
    };
    it('should handle the event', function () {
      match.handleEvent(event);
      var player = match.getPlayer(3);
      assert.equal(player.getValue('name'), 'SizzlingCalamari');
      assert.equal(player.getValue('userid'), 3);
      assert.equal(player.getValue('entindex'), 2);
      assert.equal(player.getValue('steamid'), 'STEAM_0:0:14353663');
      assert.equal(player.getValue('isBot'), false);
    });
  });

  describe('for player_team', function () {
    beforeEach(function () {
      buildPlayer(match, sizzlingPlayerData);
    });

    var event = {
      name: 'player_team'
    , timestamp: 5000
    , data: {
        name: 'SizzlingCalamari'
      , userid: 2
      , team: 2
      , oldteam: 3
      , disconnect: false
      , autoteam: false
      , silent: false
      }
    };
    it('should handle the event', function () {
      match.handleEvent(event);
      var player = match.getPlayer(2);
      assert.equal(player.getValue('team'), 2);
    });
  });
});
