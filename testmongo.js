var express = require('express');
var mongoDb = require('./mongoDb');
var app = express();

init();

function init() {
    if (mongoDb.isConnected()) {
      app.listen(8080, '127.0.0.1');
    }
    else {
      console.log('error');
    }
}
