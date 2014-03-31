'use strict';
var eventHandlers = require('./event-handlers')
  , Player = require('./player');



/**
* Match constructor
*/
var Match = module.exports = function () {
  this.hostname = '';
  this.mapname = '';
  this.bluscore = 0;
  this.redscore = 0;
  this.bluname = '';
  this.redname = '';
  this.players = [];
  this.playerEntindexes = [];
  this.playerSteamids = [];
  this.isActive = true;
};

Match.prototype.getPlayers = function () {
  return this.players;
};

Match.prototype.getPlayer = function (userid) {
  return this.players[userid];
};

Match.prototype.getPlayerByEntindex = function (entindex) {
  return this.playerEntindexes[entindex];
};

Match.prototype.getPlayerBySteamid = function (steamid) {
  return this.playerSteamids[steamid];
};

Match.prototype.addPlayer = function (data) {
  if (data.entindex == null) { throw 'Match#addPlayer: no data.entindex'; }
  if (data.isbot) {
    // FIXME
    return false;
  }
  var player = this.getPlayerBySteamid(data.steamid);
  if (!player) {
    player = new Player(data);
  }
  this.players[data.userid] = player;
  this.playerEntindexes[data.entindex] = player;
  this.playerSteamids[data.steamid] = player;
};

Match.prototype.setInactive = function (data) {
  this.isActive = false;
};

Match.prototype.setActive = function (data) {
  this.isActive = true;
};

Match.prototype.handleEvent = function (event) {
  if (this.isActive || event.name === 'stats_resetround') {
    if (eventHandlers[event.name]) {
      eventHandlers[event.name].call(this, event);
    }
  }
};
