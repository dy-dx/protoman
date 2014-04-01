'use strict'

Stats = require '../lib/stats'
Player = require '../lib/player'
player = null

defaultPlayerData = [
  name: 'SizzlingCalamari'
  steamid: 'STEAM_0:0:14353663'
  userid: 2
  entindex: 1
  teamid: 3
  class: 1
  netaddr: '192.168.1.200:27006'
  isstv: false
  isbot: false
  isreplay: false
]

buildPlayer = (data) ->
  new Player( if !data then defaultPlayerData else _.extend(defaultPlayerData, data) )


describe 'Player', ->

  describe 'constructor', ->
    beforeEach -> player = buildPlayer(class: 5)

    it 'should remap the class id', ->
      player.getRole().should.equal(7)


  describe '#setRole', ->
    beforeEach -> player = buildPlayer(class: 1)

    it 'should remap the class id', ->
      (-> player.getRole()).should.change.from(1).to(8).when -> player.setRole(2)


  describe '#playedClasses', ->
    beforeEach -> player = buildPlayer(class: 1)

    it 'should return an array of played classes', ->
      player.setRole(n) for n in [1, 2, 5]
      player.playedClasses().should.deep.equal [1,7,8]
