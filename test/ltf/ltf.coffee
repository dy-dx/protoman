'use strict'

Match = require '../../lib/match'
ltData = require '../_support/20140216010/lt'
events = require '../_support/20140216010/events'

match = new Match()
match.handleEvent(event) for event in events


describe "Compared to logs.tf", ->

  describe "base stats", ->
    statMap =
      kills: 'kills'
      assists: 'assists'
      deaths: 'deaths'
      suicides: 'suicides'
      ubers: 'ubers'
      drops: 'uberDrops'
      # heal: 'healsGiven'
      sentries: 'sentriesBuilt'
      cpc: 'pointsCaptured'
      dmg: 'damageDealt'
      dt: 'damageTaken'
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
