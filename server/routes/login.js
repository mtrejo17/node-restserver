const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!data) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña no válido'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, data.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña no válido'
                }
            });
        }

        let token = jwt.sign({
            usuario: data
        }, process.env.SEDD, { expiresIn: process.env.CADUCIDAD_TOKEN });


        res.json({
            ok: true,
            usuario: data,
            token
        });
    });
});

module.exports = app;