'use strict';
var customKillTypes = require('./custom-kill-types');

/**
* Stats constructor
*/
var Stats = module.exports = function () {
  // current values
  // this.health = 0;
  this.activationTime = null;

  // accumulated values
  this.timePlayed = 0;
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
};




Stats.setActive = function (player, timestamp) {
  if (player.getRole() === 0) { return false; }
  Stats.setValue(player, 'activationTime', timestamp);
  return true;
};

Stats.setInactive = function (player, timestamp) {
  if (player.getRole() === 0) { return false; }
  var stats = player.getStats();
  if (stats.activationTime) {
    Stats.addValue(player, 'timePlayed', timestamp - stats.activationTime);
    Stats.setValue(player, 'activationTime', null);
  }
  return true;
};


Stats.addValue = function (player, name, value) {
  player.getStats()[name] += value;
  player.getTotalStats()[name] += value;
};

Stats.setValue = function (player, name, value) {
  player.getStats()[name] = value;
  player.getTotalStats()[name] = value;
};

Stats.getValue = function (player, name) {
  return player.getStats()[name];
};
Stats.getTotal = function (player, name) {
  return player.getTotalStats()[name];
};


Stats.addItemPickup = function (player, item) {
  player.getStats().itemPickups[item] = player.getStats().itemPickups[item] + 1 || 1;
  player.getTotalStats().itemPickups[item] = player.getTotalStats().itemPickups[item] + 1 || 1;
};

Stats.getItemPickups = function (player, item) {
  return player.getTotalStats().itemPickups[item] || 0;
};


Stats.addCustomKill = function (player, customKillId) {
  var killType = customKillTypes[customKillId];
  if (!killType) {
    killType = customKillId; // for debugging;
  }

  player.getStats().customKills[killType] = (player.getStats().customKills[killType] || 0) + 1;
  player.getTotalStats().customKills[killType] = (player.getTotalStats().customKills[killType] || 0) + 1;
};

Stats.getCustomKillsByType = function (player, killType) {
  return player.getTotalStats().customKills[killType] || 0;
};


Stats.playedClasses = function (player, secondsThreshold) {
  //  We don't want to count a player as having played a class if they only played
  // it for a few seconds. So we use a threshold (tick count). Every tick is 15ms.
  secondsThreshold = (secondsThreshold == null ? 5 : secondsThreshold);
  var tickThreshold = secondsThreshold * 1000 / 15;

  var playedClasses = [];
  for (var i = 1; i < 10; i++) {
    if (player.stats[i] && player.stats[i].timePlayed > tickThreshold) {
      playedClasses.push(i);
    }
  }
  return playedClasses;
};
