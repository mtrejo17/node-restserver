const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require("underscore");

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios: data
                });
            });


        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado,
        google: body.google
    });

    usuario.save((err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json(data);
    });

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    // usamos la función pick de underscore para unicamente obtener los datos que queremos actualizar
    let body = _.pick(req.body, 'nombre', 'email', 'img', 'role', 'estado');

    //la opción { new: true } permite que el response devuelva el registro ya con el cambio, si no se pone, pone el estado previo
    // la opción  runValidators: true, forza para que en la actualización también se validen las validaciones del Schema de mongoose
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            data
        });
    });

});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    /*Usuario.findByIdAndRemove(id, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!data) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            data
        });
    });*/

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            data
        });
    });
});

module.exports = app;