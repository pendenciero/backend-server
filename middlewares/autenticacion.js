var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var retornos = require('../respuestas/retornos');

// ================================================
// Verificar Token
// ================================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            retornos.status_401(res, 'Token incorrecto', err);

            // return res.status(401).json({
            //     ok: false,
            //     mensaje: 'Token incorrecto',
            //     errors: err
            // });
        }

        req.usuario = decoded.usuario;

        next();
    });
}