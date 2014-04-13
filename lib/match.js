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
    player = new Player(data, this);
  }
  this.players[data.userid] = player;
  this.playerEntindexes[data.entindex] = player;
  this.playerSteamids[data.steamid] = player;
  return player;
};

Match.prototype.setInactive = function () {
  this.isActive = false;
};

Match.prototype.setActive = function () {
  this.isActive = true;
};


Match.prototype._shouldIgnoreEvent = (function () {
  // While the match is in an inactive state (i.e. in between rounds), we'll
  // ignore all events except these whitelisted ones.
  var whitelist = {
    stats_resetround: true
  , player_changename: true
  , player_changeclass: true
  , player_connect: true
  , player_team: true
  };
  return function (event) {
    return !this.isActive && !whitelist[event.name];
  };
})();

Match.prototype.handleEvent = function (event) {
  if (this._shouldIgnoreEvent(event)) { return false; }

  if (eventHandlers[event.name]) {
    eventHandlers[event.name].call(this, event);
  }
};
