const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const functions = require('./functions');

global.config = require('./config.json');

app.listen(global.config.api.port, function () {
    console.log('Ready in port ' + global.config.api.port);
});