'use strict';
module.exports = {
  player_death: function (event) {
    var victim = this.getPlayer(event.data.userid);
    victim.addValue('deaths', 1);
    if (event.data.attacker > 0) {
      var attacker = this.getPlayer(event.data.attacker);
      attacker.addValue('kills', 1);
      if (event.data.customkill !== 0) {
        attacker.addCustomKill(event.data.customkill);
      }
    }
    if (event.data.assister !== -1) {
      this.getPlayer(event.data.assister).addValue('assists', 1);
    }
  }
, player_hurt: function (event) {
    var victim = this.getPlayer(event.data.userid);
    victim.addValue('damageTaken', event.data.damageamount);
    if (event.data.attacker > 0) {
      var attacker = this.getPlayer(event.data.attacker);
      attacker.addValue('damageDealt', event.data.damageamount);
    }

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
    if (event.data.attacker > 0) {
      var attacker = this.getPlayer(event.data.attacker);
      attacker.addValue('medicKills', 1);
    }
    if (event.data.charged) {
      medic.addValue('uberDrops', 1);
      if (attacker) {
        attacker.addValue('medicDrops', 1);
      }
    }
  }
, player_healed: function (event) {
    var healer = this.getPlayer(event.data.healer);
    var patient = this.getPlayer(event.data.patient);
    healer.addValue('healsGiven', event.data.amount);
    patient.addValue('healsReceived', event.data.amount);
  }
, player_invulned: function (event) {
    this.getPlayer(event.data.userid).addValue('ubers', 1);
  }
, teamplay_point_captured: function (event) {
    var cappers = new Buffer(event.data.cappers);
    for (let i=0, len=cappers.length; i<len; ++i) {
      let capper = this.getPlayerByEntindex(cappers[i]);
      if (!capper) { continue; }
      capper.addValue('pointsCaptured', 1);
    }
  }
, item_pickup: function (event) {
    var player = this.getPlayer(event.data.userid);
    player.itemPickups[event.data.item] = player.itemPickups[event.data.item] + 1 || 1;
  }
, object_deflected: function (event) {
    this.getPlayer(event.data.userid).addValue('reflects', 1);
  }
, teamplay_round_win: function (event) {
    if (event.data.team === 2) {
      this.bluscore += 1;
    } else if (event.data.team === 3) {
      this.redscore += 1;
    }
  }
, player_changename: function (event) {
    this.getPlayer(event.data.userid).setValue('name', event.data.newname);
  }
, player_team: function (event) {
    if (event.data.disconnect) {
      // TODO: do something
    }
    var player = this.getPlayer(event.data.userid);
    player.setValue('team', event.data.team);
  }
, player_connect: function (event) {
    event.data.steamid = event.data.networkid;
    event.data.isbot = event.data.bot;
    // new ents get assigned an entindex of the lowest one not taken
    //  but source server events have their ent index -1 for some stupid reason
    event.data.entindex = event.data.index + 1;
    this.addPlayer(event.data);
  }
, ss_player_info: function (event) {
    this.addPlayer(event.data);
  }
, ss_tournament_match_start: function (event) {
    this.hostname = event.data.hostname;
    this.mapname = event.data.mapname;
    this.bluname = event.data.bluname;
    this.redname = event.data.redname;
  }
};
