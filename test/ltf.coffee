'use strict'

Match = require('../lib/match').Match
ltData = require './support/0827003/lt'
events = require './support/0827003/events'

match = new Match()
match.handleEvent(event) for event in events


describe 'Player stats', ->

  describe 'kills', ->
    it 'should be the same', ->
      for steamid, ltPlayer of ltData.players
        ssPlayer = match.getPlayerBySteamid steamid
        ssPlayer.getValue('kills').should.equal ltPlayer.kills


  describe 'ubers', ->
    it 'should be the same', ->
      for steamid, ltPlayer of ltData.players
        ssPlayer = match.getPlayerBySteamid steamid
        ssPlayer.getValue('ubers').should.equal ltPlayer.ubers


  describe 'assists', ->
    it 'should be the same', ->
      for steamid, ltPlayer of ltData.players
        ssPlayer = match.getPlayerBySteamid steamid
        ssPlayer.getValue('assists').should.equal ltPlayer.assists
