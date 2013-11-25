'use strict'

Match = require('../lib/match').Match
ltData = require './support/0827003/lt'
events = require './support/0827003/events'

match = new Match()
match.handleEvent(event) for event in events


describe "Compared to logs.tf", ->

  describe "base stats", ->
    statMap =
      kills: 'kills'
      assists: 'assists'
      deaths: 'deaths'
      ubers: 'ubers'
      drops: 'uberDrops'
      sentries: 'sentriesBuilt'

    for ltStat, ssStat of statMap
      it "#{ssStat} should be the same", ->
        for steamid, ltPlayer of ltData.players
          ssPlayer = match.getPlayerBySteamid steamid
          ssPlayer.getValue(ssStat).should.equal ltPlayer[ltStat]


  describe "customkills", ->
    statMap =
      headshots: 'TF_CUSTOM_HEADSHOT'
      backstabs: 'TF_CUSTOM_BACKSTAB'

    for ltStat, ssStat of statMap
      it "#{ssStat} should be the same", ->
        for steamid, ltPlayer of ltData.players
          ssPlayer = match.getPlayerBySteamid steamid
          (ssPlayer.customKills[ssStat] || 0).should.equal ltPlayer[ltStat]


  describe "item pickups", ->

    it "medkits should be the same", ->
      for steamid, ltPlayer of ltData.players
        ssPlayer = match.getPlayerBySteamid steamid
        medkits = (ssPlayer.itemPickups['medkit_small'] || 0) +
            (ssPlayer.itemPickups['medkit_medium'] || 0) * 2 +
            (ssPlayer.itemPickups['medkit_large'] || 0) * 4
        medkits.should.equal ltPlayer.medkits
