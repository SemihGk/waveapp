'use strict';

var express = require('express'),
    // session = require('express-session'),
    app = express(),
    http = require('http').Server(app),
    util = require('util'),
    path = require('path'),
    bodyParser = require('body-parser');

// var MySQLStore = require('connect-mysql')({ session: session });

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(express.static(__dirname + '/dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// var db = require('./server/models');
// var secrets = require('./config/secrets');

//MySQL Store
// app.use(session({
//   store: new MySQLStore({
//     config: secrets.mysql,
//     table: secrets.mysql.sessionTable
//   })
// }));

require('./server/models');
require('./server/modules/payroll/routes')(app);

// app.route('/file')
//   .post(upload.single('file'), function(req, res) {
//     getFileStatus(function(err, donut, bar) {
//       if(err) return res.status(400).send(err);
//       res.send({ bar: bar, donut: donut });
//     });
//   });

app.listen(8080, function() {
    console.log("Great! App is ready and running on localhost:8080");
});


/*
 * Development purpose to see consoles line and file
 */
console.log = function log() {
  var err = new Error();
  err.name = 'Trace';
  var stack = err.stack.split('\n');
  this._stdout.write(stack[2].replace(/.*\/(.*):.*/, '$1: '));
  this._stdout.write(util.format.apply(this, arguments) + '\n');
}
