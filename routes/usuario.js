var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAuthenticacion = require('../middlewares/autenticacion');

var retornos = require('../respuestas/retornos');

var app = express();

var Usuario = require('../models/usuario');


// ================================================
// Obtener todos los usuarios
// ================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    retornos.status_500(res, 'Error cargando usuarios', err);
                }

                Usuario.count({}, (err, conteo) => {
                    retornos.status_200(res, usuarios, 'usuarios', conteo);
                });
            });
});


// ================================================
// Actualizar usuario
// ================================================

app.put('/:id', mdAuthenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            retornos.status_500(res, 'Error al buscar usuario', err);
        }

        if (!usuario) {
            retornos.status_404(res, 'El usuario con el id: ' + id + ' no existe');
        }

        usuario.nombre = body.nombre;
        usuario.mail = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                retornos.status_400(res, 'Error al actualizar usuario', err)
            }

            usuarioGuardado.password = ':)';

            retornos.status_200(res, usuarios, 'usuario');

        });

    });
});


// ================================================
// Crea un nuevo usuario
// ================================================

app.post('/', mdAuthenticacion.verificaToken, (req, res) => {

    // se toma el body con la librería body-parse
    var body = req.body;

    // se configura un nuevo registro usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    // se intenta guardar el usuario
    usuario.save((err, usuarioGuardado) => {

        //si se genera un error
        if (err) {
            retornos.status_400(res, 'Error al crear usuario', err);
        }

        // si todo ha ido bien, se devuelve el usuario creado
        usuarioGuardado.password = "=)";
        retornos.status_201(res, usuarioGuardado, req.usuario);
    });
});

// ================================================
// Borrar un usuario por el id
// ================================================

app.delete('/:id', mdAuthenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findOneAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            retornos.status_500(res, 'Error al borrar usuario', err);
        }

        if (!usuarioBorrado) {
            retornos.status_404(res, 'No existe usuario con el id : ' + id);
        }

        retornos.status_200(res, usuarioBorrado, 'usuario');
    });
});

module.exports = app;