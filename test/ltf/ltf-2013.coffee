'use strict'

Match = require('../../lib/match').Match
ltData = require '../_support/20130827003/lt'
events = require '../_support/20130827003/events'

match = new Match()
match.handleEvent(event) for event in events


describe "Compared to logs.tf (2013)", ->

  describe "base stats", ->
    statMap =
      kills: 'kills'
      assists: 'assists'
      deaths: 'deaths'
      ubers: 'ubers'
      drops: 'uberDrops'
      heal: 'healsGiven'
      sentries: 'sentriesBuilt'
      cpc: 'pointsCaptured'
      dmg: 'damageDealt'
    teamMap =
      2: "Red"
      3: "Blue"

    for ltStat, ssStat of statMap
      do (ltStat, ssStat) ->
        it "#{ssStat} should be the same", ->
          for steamid, ltPlayer of ltData.players
            ssPlayer = match.getPlayerBySteamid steamid
            ssPlayer.getValue(ssStat).should.equal ltPlayer[ltStat]

    it "team should be the same", ->
      for steamid, ltPlayer of ltData.players
        teamId = match.getPlayerBySteamid(steamid).getValue 'team'
        ltPlayer.team.should.equal teamMap[teamId]

  describe "customkills", ->
    statMap =
      headshots: 'TF_CUSTOM_HEADSHOT'
      backstabs: 'TF_CUSTOM_BACKSTAB'

    for ltStat, ssStat of statMap
      do (ltStat, ssStat) ->
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
