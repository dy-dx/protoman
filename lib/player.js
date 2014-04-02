'use strict';
var Stats = require('./stats');

/**
* Player constructor
*/
var Player = module.exports = function (data) {
  this.totalStats = new Stats();
  this.stats = [];

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
    this.setRole(data.class);
  }
};


// I use the word "role" instead of "class" to refer to scout/soldier/etc
Player.prototype.setRole = function (classId) {
  // the game doesn't report the classes by their nominal 1-9, so remap here
  this.role = [0,1,8,2,4,7,5,3,9,6][classId];
  if (this.role !== 0 && !this.stats[this.role]) { this.stats[this.role] = new Stats(); }
};

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

