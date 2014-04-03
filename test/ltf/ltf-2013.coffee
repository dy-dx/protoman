'use strict'

Match = require '../../lib/match'
Stats = require '../../lib/stats'
ltData = require '../_support/20130827003/lt'
events = require '../_support/20130827003/events'
match = null


describe "Compared to logs.tf (2013)", ->
  before ->
    match = new Match()
    match.handleEvent(event) for event in events

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
            Stats.getTotal(ssPlayer, ssStat).should.equal ltPlayer[ltStat]

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
            Stats.getCustomKillsByType(ssPlayer, ssStat).should.equal ltPlayer[ltStat]


  describe "item pickups", ->

    it "medkits should be the same", ->
      for steamid, ltPlayer of ltData.players
        ssPlayer = match.getPlayerBySteamid steamid
        medkits = Stats.getItemPickups(ssPlayer, 'medkit_small') +
            Stats.getItemPickups(ssPlayer, 'medkit_medium') * 2 +
            Stats.getItemPickups(ssPlayer, 'medkit_large') * 4
        medkits.should.equal ltPlayer.medkits


  describe "played classes counted", ->

    it "should be the same (with threshold of 8 seconds)", ->
      for steamid, ltPlayer of ltData.players
        ssPlayer = match.getPlayerBySteamid steamid
        Stats.playedClasses(ssPlayer, 8).length.should.equal ltPlayer.class_stats.length


  describe "class stats", ->
    statMap =
      kills: 'kills'
      assists: 'assists'
      deaths: 'deaths'
      dmg: 'damageDealt'

    classMap = [null, 'scout', 'soldier', 'pyro', 'demoman', 'heavyweapons', 'engineer', 'medic', 'sniper', 'spy']

    for ltStat, ssStat of statMap
      do (ltStat, ssStat) ->
        it "#{ssStat} should be the same", ->
          for steamid, ltPlayer of ltData.players
            ssPlayer = match.getPlayerBySteamid steamid
            for ltClassStats in ltPlayer.class_stats
              roleId = classMap.indexOf ltClassStats.type
              ssPlayer.getStats(roleId)[ssStat].should.equal ltClassStats[ltStat]
