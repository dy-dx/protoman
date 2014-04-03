'use strict';
var Stats = require('./stats');

module.exports = {
  player_death: function (event) {
    var victim = this.getPlayer(event.data.userid);

    if (event.data.death_flags === 160) {
      // Feigned death (Dead Ringer)
      return Stats.addValue(victim, 'feignedDeaths', 1);
    }

    Stats.addValue(victim, 'deaths', 1);

    if (event.data.attacker === event.data.userid) {
      // Suicides
      Stats.addValue(this.getPlayer(event.data.userid), 'suicides', 1);
    } else if (event.data.attacker > 0) {
      var attacker = this.getPlayer(event.data.attacker);
      Stats.addValue(attacker, 'kills', 1);
      if (event.data.customkill !== 0) {
        Stats.addCustomKill(attacker, event.data.customkill);
      }
    }
    if (event.data.assister > 0) {
      Stats.addValue(this.getPlayer(event.data.assister), 'assists', 1);
    }
  }
, player_hurt: function (event) {
    // Don't count fall damage
    if (event.data.attacker === 0) { return; }
    // Don't count self-damage
    if (event.data.attacker === event.data.userid) { return; }

    var victim = this.getPlayer(event.data.userid);
    var attacker = this.getPlayer(event.data.attacker);
    Stats.addValue(victim, 'damageTaken', event.data.damageamount);
    Stats.addValue(attacker, 'damageDealt', event.data.damageamount);

    // var realDamage = event.data.health - victim.getValue('health');
    // victim.setValue('health', event.data.health);
    // if (realDamage < 0) {
    //   // throw an error or something
    //   return;
    // }
    // victim.addValue('realDamageTaken', realDamage);
    // attacker.addValue('realDamageDealt', realDamage);
  }
, medic_death: function (event) {
    var medic = this.getPlayer(event.data.userid);
    var attacker = null;
    if (event.data.attacker > 0) {
      attacker = this.getPlayer(event.data.attacker);
      Stats.addValue(attacker, 'medicKills', 1);
    }
    if (event.data.charged) {
      Stats.addValue(medic, 'uberDrops', 1);
      if (attacker) {
        Stats.addValue(attacker, 'medicDrops', 1);
      }
    }
  }
, player_healed: function (event) {
    var healer = this.getPlayer(event.data.healer);
    var patient = this.getPlayer(event.data.patient);
    Stats.addValue(healer, 'healsGiven', event.data.amount);
    Stats.addValue(patient, 'healsReceived', event.data.amount);
  }
, player_chargedeployed: function (event) {
    Stats.addValue(this.getPlayer(event.data.userid), 'ubers', 1);
  }
, player_invulned: function (event) {
    // TODO: do something better with this
    Stats.addValue(this.getPlayer(event.data.userid), 'ubered', 1);
  }
, teamplay_point_captured: function (event) {
    var cappers = new Buffer(event.data.cappers);
    for (var i=0, len=cappers.length; i<len; ++i) {
      var capper = this.getPlayerByEntindex(cappers[i]);
      if (!capper) { continue; }
      Stats.addValue(capper, 'pointsCaptured', 1);
    }
  }
, item_pickup: function (event) {
    Stats.addItemPickup(this.getPlayer(event.data.userid), event.data.item);
  }
, player_builtobject: function (event) {
    if (event.data.object === 2) {
      Stats.addValue(this.getPlayer(event.data.userid), 'sentriesBuilt', 1);
    }
  }
, object_deflected: function (event) {
    // TODO: Test this
    Stats.addValue(this.getPlayer(event.data.userid), 'reflects', 1);
  }
, teamplay_round_win: function (event) {
    if (event.data.team === 2) {
      this.bluscore += 1;
    } else if (event.data.team === 3) {
      this.redscore += 1;
    }
    this.setInactive();
    this.getPlayers().forEach(function (player) {
      Stats.setInactive(player, event.timestamp);
    });
  }
, stats_resetround: function (event) {
    this.setActive();
    this.getPlayers().forEach(function (player) {
      Stats.setActive(player, event.timestamp);
    });
  }
, player_changename: function (event) {
    this.getPlayer(event.data.userid).setValue('name', event.data.newname);
  }
, player_changeclass: function (event) {
    var player = this.getPlayer(event.data.userid);
    Stats.setInactive(player, event.timestamp);
    player.setRole(event.data.class);
    Stats.setActive(player, event.timestamp);
  }
, player_team: function (event) {
    var player = this.getPlayer(event.data.userid);
    if (event.data.disconnect) {
      delete this.players[event.data.userid];
    }
    player.setValue('team', event.data.team);
    if (event.data.team !== 2 && event.data.team !== 3) {
      Stats.setInactive(player, event.timestamp);
    }
  }
, player_connect: function (event) {
    event.data.steamid = event.data.networkid;
    event.data.isbot = !!event.data.bot;
    //  New ents get assigned an entindex of the lowest one not taken
    // but source server events have their ent index -1 for some stupid reason
    // (https://wiki.alliedmods.net/Generic_Source_Server_Events)
    event.data.entindex = event.data.index + 1;
    this.addPlayer(event.data);
  }
, ss_player_info: function (event) {
    var player = this.addPlayer(event.data);
    if (player) { Stats.setActive(player, event.timestamp); }
  }
, ss_tournament_match_start: function (event) {
    this.hostname = event.data.hostname;
    this.mapname = event.data.mapname;
    this.bluname = event.data.bluname;
    this.redname = event.data.redname;
  }
};
