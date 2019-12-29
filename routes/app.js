var express = require('express');
var app = express();

var retornos = require('../respuestas/retornos');

app.get('/', (req, res, next) => {
    retornos.status_200(res, 'Petición realizada correctamente');
});

module.exports = app;