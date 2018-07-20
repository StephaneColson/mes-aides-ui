var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var Raven = require('raven');

// Setup mongoose
require('./config/mongoose')(mongoose, config);

// Setup Express
var app = express();

// Enable Sentry in production
// It expects SENTRY_DSN environment variable to be defined
if (app.get('env') === 'production') {
    Raven.config().install();
    app.use(Raven.requestHandler());
}

app.use(require('./lib/ludwig')(mongoose, mongoose.model('Situation')));
app.use(require('./config/api'));

if (app.get('env') === 'production') {
    app.use(Raven.errorHandler());
}

module.exports = app;
