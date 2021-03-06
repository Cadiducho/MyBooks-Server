const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const functions = require('./functions');

global.config = require('./config.json');

require('./routes/users')(app)
require('./routes/libraries')(app)

app.listen(global.config.api.port, function () {
    console.log('Ready in port ' + global.config.api.port);
});