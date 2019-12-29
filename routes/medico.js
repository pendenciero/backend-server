var express = require('express');
var mdAuthenticacion = require('../middlewares/autenticacion');
var retornos = require('../respuestas/retornos');

var app = express();

var Medico = require('../models/medico');

// ================================================
// Obtener todos los medicos
// ================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    retornos.status_500(res, 'Error al traer los medicos', err);
                }

                Medico.count({}, (err, conteo) => {
                    retornos.status_200(res, medicos, 'medicos', conteo);
                });
            });
});

// ================================================
// Actualiza un medico
// ================================================

app.put('/:id', mdAuthenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            retornos.status_500(res, 'Error al buscar medico');
        }

        if (!medico) {
            retornos.status_404(res, 'El medico con el id: ' + id + ' no existe');
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital

        medico.save((err, medicoGuardado) => {

            if (err) {
                retornos.status_400(res, 'Error al actualizar medico', err);
            }

            retornos.status_200(res, medicoGuardado, 'medico');
        });

    });
});

// ================================================
// Crear un nuevo medico
// ================================================

app.post('/', mdAuthenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });


    medico.save((err, medicoGuardado) => {

        if (err) {
            retornos.status_400(res, 'Error al crear un nuevo medico');
        }

        retornos.status_201(res, medicoGuardado, null);
    });
});

// ================================================
// Borrar un medico por id
// ================================================

app.delete('/:id', mdAuthenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findOneAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            retornos.status_500(res, 'Error al borrar medico');
        }

        if (!medicoBorrado) {
            retornos.status_404(res, 'No existe medico con el id : ' + id);
        }

        retornos.status_200(res, medicoBorrado, 'medico');
    });
});



module.exports = app;