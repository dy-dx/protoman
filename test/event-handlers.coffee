'use strict'

Match = require('../lib/match').Match

# don't know where this belongs
buildPlayer = (match, playerData) ->
  match.addPlayer(playerData)

sizzlingPlayerData =
  name: 'SizzlingCalamari'
  userid: 2
  entindex: 1
  steamid: 'STEAM_0:0:14353663'
  teamid: 3
  netaddr: '192.168.1.200:27006'
  isstv: false
  isbot: false
  isreplay: false


describe 'Match event handler', ->
  match = null
  beforeEach ->
    match = new Match()

  describe 'for ss_tournament_match_start', ->
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


  describe 'for ss_player_info', ->
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
      player.getValue('team'    ).should.equal 3


  describe 'for player_connect', ->
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


  describe 'for player_team', ->
    beforeEach ->
      buildPlayer(match, sizzlingPlayerData)

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
