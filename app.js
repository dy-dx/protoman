'use strict';
var inspect = require('./lib/inspect')
  , debug = require('debug')('protoman:app')
  , parser = require('./lib/parser')
  , Match = require('./lib/match').Match
  , logPath = __dirname + '/sizz.b64.log';


var events = parser.getEvents(logPath);
// debug(events);


var match = new Match();

for (var i=0, len=events.length; i<len; ++i) {
  match.handleEvent(events[i]);
}

debug('match#getPlayers()', inspect(match.getPlayers()));
