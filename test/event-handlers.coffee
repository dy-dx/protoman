'use strict'

Match = require '../lib/match'
Stats = require '../lib/stats'
match = null

# don't know where this belongs
addPlayers = (playerData...) ->
  if !playerData.length
    match.addPlayer player for player in defaultPlayerData
  else
    match.addPlayer _.extend(defaultPlayerData[index], player) for player, index in playerData


# TODO: move these into a factories file
defaultPlayerData = [
  name: 'SizzlingCalamari'
  steamid: 'STEAM_0:0:14353663'
  userid: 2
  entindex: 1
  teamid: 3
  class: 7
  netaddr: '192.168.1.200:27006'
  isstv: false
  isbot: false
  isreplay: false
,
  name: 'technosex'
  steamid: 'STEAM_0:0:17990207'
  userid: 3
  entindex: 2
  teamid: 3
  class: 7
  netaddr: '47.16.233.15:27005'
  isstv: false
  isbot: false
  isreplay: false
,
  name: 'L-block'
  steamid: 'STEAM_0:1:29695006'
  userid: 4
  entindex: 3
  teamid: 2
  class: 7
  netaddr: '71.123.210.125:27005'
  isstv: false
  isbot: false
  isreplay: false
]



describe 'Match event handler for', ->
  beforeEach ->
    match = new Match()

  describe 'ss_tournament_match_start', ->
    event =
      name: 'ss_tournament_match_start'
      timestamp: 5000
      data:
        hostname: 'Team Fortress'
        mapname: 'cp_badlands'
        bluname: 'BLU'
        redname: 'RED'

    it 'should handle the event', ->
      match.handleEvent event
      match.hostname.should.equal 'Team Fortress'
      match.mapname.should.equal 'cp_badlands'
      match.bluname.should.equal 'BLU'
      match.redname.should.equal 'RED'


  describe 'ss_player_info', ->
    event =
      name: 'ss_player_info'
      timestamp: 5000
      data:
        name: 'SizzlingCalamari'
        userid: 2
        entindex: 1
        steamid: 'STEAM_0:0:14353663'
        teamid: 3
        netaddr: '192.168.1.200:27006'
        class: 1
        isstv: false
        isbot: false
        isreplay: false

    it 'should handle the event', ->
      match.handleEvent event
      player = match.getPlayer 2
      player.getValue('name'    ).should.equal 'SizzlingCalamari'
      player.getValue('userid'  ).should.equal 2
      player.getValue('entindex').should.equal 1
      player.getValue('steamid' ).should.equal 'STEAM_0:0:14353663'
      player.getValue('team'    ).should.equal 3
      player.getValue('address' ).should.equal '192.168.1.200:27006'
      player.getValue('isStv'   ).should.equal false
      player.getValue('isBot'   ).should.equal false
      player.getValue('isReplay').should.equal false


  describe 'player_connect', ->
    event =
      name: 'player_connect'
      timestamp: 5000
      data:
        name: 'SizzlingCalamari'
        index: 1
        userid: 3
        networkid: 'STEAM_0:0:14353663'
        address: '173.242.129.118:27005'
        bot: 0

    it 'should handle the event', ->
      match.handleEvent event
      player = match.getPlayer 3
      player.getValue('name'     ).should.equal 'SizzlingCalamari'
      player.getValue('userid'   ).should.equal 3
      player.getValue('entindex' ).should.equal 2
      player.getValue('steamid'  ).should.equal 'STEAM_0:0:14353663'
      player.getValue('isBot'    ).should.equal false


  describe 'player_changeclass', ->
    player = null
    changeClassEvent = (classId = 5, timestamp = 5000) ->
      name: 'player_changeclass'
      timestamp: timestamp
      data:
        userid: 2
        class: classId

    beforeEach ->
      addPlayers {userid: 2, entindex: 1, class: 2} # class 2 maps to role 8
      player = match.getPlayer(2)

    it 'should map and set the player\'s role', ->
      (-> player.getRole()).should.change.from(8).to(7).when ->
        match.handleEvent changeClassEvent(5)


    describe 'while the match is inactive', ->
      beforeEach ->
        Stats.setActive(player, 1000)
        match.handleEvent { name: 'teamplay_round_win', timestamp: 2000, data: {} }
        match.handleEvent changeClassEvent(1, 3000) # class 1 maps to role 1

      it 'should still map and set the player\'s role', ->
        player.getRole().should.equal 1




  describe 'player_team', ->
    beforeEach ->
      addPlayers()

    event =
      name: 'player_team'
      timestamp: 5000
      data:
        name: 'SizzlingCalamari'
        userid: 2
        team: 2
        oldteam: 3
        disconnect: false
        autoteam: false
        silent: false

    it 'should handle the event', ->
      match.handleEvent event
      player = match.getPlayer 2
      player.getValue('team').should.equal 2


  describe 'player_death', ->
    beforeEach ->
      addPlayers {userid: 2, entindex: 1}, {userid: 3, entindex: 2}, {userid: 4, entindex: 3}

    describe 'typical case', ->
      event =
        name: 'player_death'
        timestamp: 30654
        data:
          userid: 4
          victim_entindex: 3
          inflictor_entindex: 449
          attacker: 2
          weapon: 'tf_projectile_rocket'
          weaponid: 22
          damagebits: 2359360
          customkill: 0
          assister: 3
          weapon_logclassname: 'tf_projectile_rocket'
          stun_flags: 0
          death_flags: 128
          silent_kill: false
          playerpenetratecount: 0
          assister_fallback: ''

      it "should increment the attacker's kills by 1", ->
        (-> Stats.getValue(match.getPlayer(2), 'kills')).should.change.by(+1).when ->
          match.handleEvent event

      it "should increment the assister's assists by 1", ->
        (-> Stats.getValue(match.getPlayer(3), 'assists')).should.change.by(+1).when ->
          match.handleEvent event

      it "should increment the victim's deaths by 1", ->
        (-> Stats.getValue(match.getPlayer(4), 'deaths')).should.change.by(+1).when ->
          match.handleEvent event

    describe 'suicide', ->
      event =
        name: 'player_death'
        timestamp: 47124
        data:
          userid: 2
          victim_entindex: 1
          inflictor_entindex: 1
          attacker: 2
          weapon: 'world'
          weaponid: 0
          damagebits: 6144
          customkill: 6
          assister: -1
          weapon_logclassname: 'world'
          stun_flags: 0
          death_flags: 0
          silent_kill: false
          playerpenetratecount: 0
          assister_fallback: ''

      it "should not increment the attacker's kills", ->
        (-> Stats.getValue(match.getPlayer(2), 'kills')).should.not.change.when ->
          match.handleEvent event

      it "should increment the victim's deaths by 1", ->
        (-> Stats.getValue(match.getPlayer(2), 'deaths')).should.change.by(+1).when ->
          match.handleEvent event

      it "should increment the victim's suicides by 1", ->
        (-> Stats.getValue(match.getPlayer(2), 'suicides')).should.change.by(+1).when ->
          match.handleEvent event


    describe 'feigned death', ->
      event =
        name: 'player_death',
        timestamp: 35721,
        data:
          userid: 4
          victim_entindex: 3
          inflictor_entindex: 465
          attacker: 2
          weapon: 'tf_projectile_rocket'
          weaponid: 22
          damagebits: 2359360
          customkill: 0
          assister: 3
          weapon_logclassname: 'tf_projectile_rocket'
          stun_flags: 0
          death_flags: 160
          silent_kill: false
          playerpenetratecount: 0
          assister_fallback: 'b#TF_LinuxItem'

      it "should not increment the attacker's kills", ->
        (-> Stats.getValue(match.getPlayer(2), 'kills')).should.not.change.when ->
          match.handleEvent event

      it "should not increment the assister's assists", ->
        (-> Stats.getValue(match.getPlayer(3), 'assists')).should.not.change.when ->
          match.handleEvent event

      it "should not increment the victim's deaths", ->
        (-> Stats.getValue(match.getPlayer(4), 'deaths')).should.not.change.when ->
          match.handleEvent event

      it "should increment the victim's feignedDeaths by 1", ->
        (-> Stats.getValue(match.getPlayer(4), 'feignedDeaths')).should.change.by(+1).when ->
          match.handleEvent event


  describe 'player_chargedeployed', ->
    beforeEach ->
      addPlayers()

    event =
      name: 'player_chargedeployed'
      timestamp: 5000
      data:
        userid: 2
        targetid: 4

    it "should increment the player's ubers by 1", ->
      (-> Stats.getValue(match.getPlayer(2), 'ubers')).should.change.by(+1).when ->
        match.handleEvent event
