var net = require('net');
var fs = require('fs');

var cfg = {
  port: 8007
, logPath: __dirname + '/log.log'
};

console.log('logging to', cfg.logPath);

var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  c.write('hello\r\n');

  c.on('end', function() {
    console.log('server disconnected');
  });

  c.on('data', function(data) {
    var msg = data.toString('ascii');
    fs.appendFileSync(cfg.logPath, msg, 'ascii', function(err) {
      if (err) { console.log(err) };
    });
  });

});

server.listen(cfg.port, function() { //'listening' listener
  console.log('server bound on port', cfg.port);
});
