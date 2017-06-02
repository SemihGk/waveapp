'use strict';

var express = require('express'),
    // session = require('express-session'),
    app = express(),
    http = require('http').Server(app),
    util = require('util'),
    path = require('path'),
    bodyParser = require('body-parser'),
    config = require('./config');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(express.static(__dirname + '/dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// route direction
require('./server/modules/payroll/routes')(app);

const models = require('./server/models');
// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function () {
    app.listen(config.port, function() {
        console.log("Great! App is ready and running on localhost:" + config.port);
    });
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
