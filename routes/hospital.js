var express = require('express');
var mdAuthenticacion = require('../middlewares/autenticacion');
var retornos = require('../respuestas/retornos');

var app = express();

var Hospital = require('../models/hospital');

// ================================================
// Obtener todos los hospitales
// ================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    retornos.status_500(res, 'Error al traer los hospitales', err);
                }

                Hospital.count({}, (err, conteo) => {
                    retornos.status_200(res, hospitales, 'hospitales', conteo);
                });
            });
});

// ================================================
// Actualiza un hospital
// ================================================

app.put('/:id', mdAuthenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            retornos.status_500(res, 'Error al buscar hospital');
        }

        if (!hospital) {
            retornos.status_404(res, 'El hospital con el id: ' + id + ' no existe');
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                retornos.status_400(res, 'Error al actualizar hospital', err);
            }

            retornos.status_200(res, hospitalGuardado, 'hospital');
        });

    });
});

// ================================================
// Crear un nuevo hospital
// ================================================

app.post('/', mdAuthenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            retornos.status_400(res, 'Error al crear un nuevo hospital');
        }

        retornos.status_201(res, hospitalGuardado, null);
    });
});

// ================================================
// Borrar un hospital por id
// ================================================

app.delete('/:id', mdAuthenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findOneAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            retornos.status_500(res, 'Error al borrar hospital');
        }

        if (!hospitalBorrado) {
            retornos.status_404(res, 'No existe hospital con el id : ' + id);
        }

        retornos.status_200(res, hospitalBorrado, 'hospital');
    });
});



module.exports = app;