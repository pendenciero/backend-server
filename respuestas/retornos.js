var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

exports.status_500 = function(res, mensaje, error) {
    return res.status(500).json({
        ok: false,
        mensaje: mensaje,
        errors: error
    });
}

// exports.status_200 = function(res, respuesta) {
//     res.status(200).json({
//         ok: true,

//     });
// }


exports.status_200 = function(res, respuesta, valorResp, conteo) {

    if (conteo) {
        res.status(200).json({
            ok: true,
            mensaje: 'Se ha realizado la acción correctamente',
            [valorResp]: respuesta,
            total: conteo
        });
    } else {
        res.status(200).json({
            ok: true,
            mensaje: 'Se ha realizado la acción correctamente',
            [valorResp]: respuesta,
        });
    }
}


function createDinamicArray(vName, vValue, conteo) {
    var ary = [];

    var cuenta = conteo || 0;

    var obj = {};
    obj['ok'] = true;
    obj[vName] = vValue;
    obj['total'] = cuenta;
    ary.push(obj);

    return ary;
}

exports.status_404 = function(res, mensaje) {
    return res.status(404).json({
        ok: false,
        mensaje: mensaje,
        errors: { message: mensaje }
    });
}

exports.status_400 = function(res, mensaje, error) {
    return res.status(400).json({
        ok: false,
        mensaje: mensaje,
        errors: { message: error }
    });
}

exports.status_401 = function(res, mensaje, error) {
    return res.status(401).json({
        ok: false,
        mensaje: mensaje,
        errors: error
    });
}

exports.status_201 = function(res, resp, resptoken) {
    res.status(201).json({
        ok: true,
        resp: resp,
        resptoken: resptoken
    });
}