var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var retornos = require('../respuestas/retornos');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//middleware
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        retornos.status_400(res, 'Tipo de colección no válida', 'Tipo de colección no válida');
    }

    if (!req.files) {
        retornos.status_400(res, 'No se ha seleccionado un archivo', 'Debe seleccionar un archivo');
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extesionArchivo = nombreCortado[nombreCortado.length - 1];

    // valida extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.lastIndexOf(extesionArchivo) < 0) {
        retornos.status_400(res, 'Extensión no válida', 'Las extensiones validas son : ' + extensionesValidas.join(', '));
    }

    // Nombre archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds( )}.${ extesionArchivo }`;

    // Mover archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo}`;
    archivo.mv(path, err => {

        if (err) {
            retornos.status_500(res, 'Error al mover archivo', err);
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });

});


// se debería refactorizar este métodó
function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                retornos.status_404(res, 'No existe el id de usuario');
            }

            if (err) {
                retornos.status_500(res, 'Se produjo un error al buscar usuario', err);
            }

            var pathActual = './uploads/usuarios/' + usuario.img;

            // si existe un archivo anterior, se elimina
            if (fs.existsSync(pathActual)) {
                fs.unlink(pathActual);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = '=)';

                if (err) {
                    retornos.status_500(res, 'Error al actualizar el usuario', err);
                }

                retornos.status_200(res, usuarioActualizado, 'usuario');
            });

        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                retornos.status_404(res, 'No existe el id de medico');
            }

            if (err) {
                retornos.status_500(res, 'Se produjo un error al buscar medico', err);
            }

            var pathActual = './uploads/medicos/' + medico.img;

            // si existe un archivo anterior, se elimina
            if (fs.existsSync(pathActual)) {
                fs.unlink(pathActual);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                if (err) {
                    retornos.status_500(res, 'Error al actualizar el medico', err);
                }

                retornos.status_200(res, medicoActualizado, 'medico');
            });

        });

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                retornos.status_404(res, 'No existe el id de usuario');
            }

            if (err) {
                retornos.status_500(res, 'Se produjo un error al buscar hospital', err);
            }

            var pathActual = './uploads/hospitales/' + hospital.img;

            // si existe un archivo anterior, se elimina
            if (fs.existsSync(pathActual)) {
                fs.unlink(pathActual);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    retornos.status_500(res, 'Error al actualizar el hospital', err);
                }

                retornos.status_200(res, hospitalActualizado, 'hospital');
            });

        });
    }

}

module.exports = app;