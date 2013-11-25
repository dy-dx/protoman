'use strict'

Match = require('../lib/match').Match
ltData = require './support/0827003/lt'
events = require './support/0827003/events.js'

match = new Match()
match.handleEvent(event) for event in events


describe 'Player stats', ->

  describe 'ubers', ->
    it 'should be the same', ->
      for steamid, ltPlayer of ltData.players
        ssPlayer = match.getPlayerBySteamid steamid
        ssPlayer.getValue('ubers').should.equal ltPlayer.ubers
