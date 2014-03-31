'use strict';
var customKillTypes = require('./custom-kill-types');

/**
* Player constructor
*/
var Player = module.exports = function (data) {
  // current values
  // this.health = 0;

  // accumulated values
  this.kills = 0;
  this.assists = 0;
  this.deaths = 0;
  this.suicides = 0;
  this.feignedDeaths = 0;
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
  this.sentriesBuilt = 0;
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
