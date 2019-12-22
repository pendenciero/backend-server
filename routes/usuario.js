var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAuthenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');


// ================================================
// Obtener todos los usuarios
// ================================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios // esto se podría devolver solo con usuarios
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
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.mail = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuarios: usuarioGuardado
            });

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
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        // si todo ha ido bien, se devuelve el usuario creado
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });
});

// ================================================
// Borrar un usuario por el id
// ================================================

app.delete('/:id', mdAuthenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findOneAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: { message: 'No existe el usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;