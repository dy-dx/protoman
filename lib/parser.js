'use strict';
var fs = require('fs')
  , Schema = require('protobuf').Schema
  , schema = new Schema(fs.readFileSync('schema/SizzEvent.desc'))
  , SizzEvent = schema['SizzEvent.SizzEvent'];

var compactor = function (input) {
  var output = {
    name: input.eventName
  , timestamp: input.eventTimestamp
  };
  if (!input.eventData) {
    return output;
  }

  output.data = {};
  input.eventData.forEach(function (elem) {
    output.data[elem.keyName] = elem[elem.valueType];
  });

  return output;
};

var getEvents = function(logPath) {
  var events = [];
  var b64lines = fs.readFileSync(logPath, 'utf8').split('\n');

  var lines = b64lines.map(function (line) {
    return new Buffer(line, 'base64');
  });

  var data = Buffer.concat(lines);
  var messageStart = 0;

  while (messageStart < data.length) {
    var messageLength = data.readUInt16BE(messageStart);
    var message = data.slice(2 + messageStart, 2 + messageStart + messageLength);
    events.push(compactor(SizzEvent.parse(message)));

    messageStart = 2 + messageStart + messageLength;
  }
  return events;
};


module.exports.getEvents = getEvents;
