var fs = require('fs')
  , Schema = require('protobuf').Schema;

var schema = new Schema(fs.readFileSync('schema/SizzEvent.desc'));
var SizzEvent = schema['SizzEvent.SizzEvent'];

var logPath = __dirname + '/sizz.b64.log';

var lines = fs.readFileSync(logPath, 'utf8').split('\n');


var events = lines.map(function (line) {
  return new Buffer(line, 'base64');
});

for (var i=0, len=events.length; i<len; ++i) {
  console.log(events[i].toString('utf8'))
  console.log(SizzEvent.parse(events[i]));
}
