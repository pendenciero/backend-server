var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var retornos = require('../respuestas/retornos');

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            retornos.status_500(res, 'Error al buscar usuario', err);
        }

        if (!usuarioDB) {
            retornos.status_400(res, 'Credenciales incorrectas -email', err);
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            retornos.status_400(res, 'Credenciales incorrectas -password', err);
        }

        // Crear un token
        usuarioDB.password = '=)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 26297500000 }); // 10 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });

});

module.exports = app;