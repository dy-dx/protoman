'use strict';
var Stats = require('./stats');

/**
* Player constructor
*/
var Player = module.exports = function (data) {
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
  // FIXME
  this.role = 1;

  this.totalStats = new Stats();
  this.stats = [];
  for (var i = 1; i<10; i++) {
    this.stats[i] = new Stats();
  }
};


// I use the word "role" instead of "class" to refer to scout/soldier/etc
Player.prototype.getRole = function () {
  return this.role;
};

Player.prototype.getStats = function (role) {
  if (role) { return this.stats[role]; }
  return this.stats[this.getRole()];
};

Player.prototype.getTotalStats = function () {
  return this.totalStats;
};


Player.prototype.getValue = function (name) {
  return this[name];
};

Player.prototype.setValue = function (name, value) {
  this[name] = value;
};
