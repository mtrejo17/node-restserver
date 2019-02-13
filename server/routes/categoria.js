const express = require('express');
const { verficaToken, verficaAdmin } = require('../middlewares/autenticacion.js');
const Categoria = require('../models/categoria');

const app = express();


app.get('/categoria', verficaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!data) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json(data);
        });
});

app.get('/categoria/:id', verficaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No existe id"
                }
            });
        }

        res.json(data);
    });


});

app.post('/categoria', verficaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json(data);
    });
});

app.put('/categoria/:id', verficaToken, (req, res) => {
    let id = req.params.id;
    body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json(data);
    });

});

app.delete('/categoria/:id', [verficaToken, verficaAdmin], verficaAdmin, (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            });
        }


        res.json(data);
    });
});

module.exports = app;