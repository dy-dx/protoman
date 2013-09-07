'use strict';
var eventHandlers = require('./event-handlers')
  , customKillTypes = require('./custom-kill-types');
/**
* Player constructor
*/
var Player = module.exports.Player = function (data) {
  // current values
  // this.health = 0;

  // accumulated values
  this.kills = 0;
  this.assists = 0;
  this.deaths = 0;
  this.damageDealt = 0;
  this.damageTaken = 0;
  // this.realDamageDealt = 0;
  // this.realDamageTaken = 0;
  this.reflects = 0;
  this.ubers = 0;
  this.healsGiven = 0;
  this.healsReceived = 0;
  this.uberDrops = 0;
  this.pointsCaptured = 0;
  this.medicKills = 0;
  this.medicDrops = 0;
  this.customKills = {};
  this.itemPickups = {};

  if (data) {
    this.userid = data.userid;
    this.entindex = data.entindex;
    this.name = data.name;
    this.steamid = data.steamid;
    this.team = data.teamid;
    this.address = data.netaddr;
    this.isBot = data.isbot;
    this.isStv = data.isstv;
    this.isReplay = data.isreplay;
  }
};

Player.prototype.addValue = function (name, value) {
  return this[name] += value;
};

Player.prototype.getValue = function (name) {
  return this[name];
};

Player.prototype.setValue = function (name, value) {
  this[name] = value;
};

Player.prototype.addCustomKill = function (customKillId) {
  var killType = customKillTypes[customKillId];
  if (!killType) {
    killType = customKillId; // for debugging
  }
  this.customKills[killType] = (this.customKills[killType] || 0) + 1;
};



/**
* Match constructor
*/
var Match = module.exports.Match = function () {
  this.hostname = '';
  this.mapname = '';
  this.bluscore = 0;
  this.redscore = 0;
  this.bluname = '';
  this.redname = '';
  this.players = [];
  this.playerEntindexes = [];
  this.playerSteamids = [];
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

Match.prototype.handleEvent = function (event) {
  if (eventHandlers[event.name]) {
    eventHandlers[event.name].call(this, event);
  }
};
