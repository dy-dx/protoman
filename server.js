'use strict';
var net = require('net')
  , fs = require('fs')
  , dateFormat = require('dateformat');

var cfg = {
  port: 8007
, logPath: __dirname + '/logs/'
};

function setNewLogFile () {
  cfg.logPath = __dirname + '/logs/' + dateFormat(new Date(), "yyyy_mm_dd-HH_MM_sso") + '.b64.log';
  console.log('Set new logfile', cfg.logPath);
}
setNewLogFile();

var server = net.createServer(function (c) { //'connection' listener
  console.log('server connected');
  c.write('hello\r\n');

  c.on('error', function (error) {
    console.log('error:', error);
    setNewLogFile();
  });

  c.on('end', function () {
    console.log('server disconnected');
    setNewLogFile();
  });

  c.on('data', function (data) {
    var msg = data.toString('base64') + '\n';
    c.write('HELLO JORDAN\r\n');

    fs.appendFileSync(cfg.logPath, msg);
  });

});

server.listen(cfg.port, function () { //'listening' listener
  console.log('server bound on port', cfg.port);
});
