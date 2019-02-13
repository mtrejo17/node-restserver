const express = require('express');
const { verficaToken } = require('../middlewares/autenticacion.js');
const Producto = require('../models/producto');
const app = express();

app.get('/productos', verficaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos: data
            });
        });
});

app.get('/producto/:id', verficaToken, (req, res) => {
    Producto.findById(req.params.id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
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
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }
            res.status(200).json({
                ok: true,
                producto: data
            });
        });

});


app.get('/producto/buscar/:termino', verficaToken, (req, res) => {

    let regex = new RegExp(req.params.termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
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
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }
            res.status(200).json({
                ok: true,
                productos: data
            });
        });
});

app.post('/producto', verficaToken, (req, res) => {
    let body = req.body
    console.log('body-->', body);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, data) => {
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

        res.status(201).json({
            ok: true,
            producto: data
        });
    });

});

app.put('/producto/:id', verficaToken, (req, res) => {

    Producto.findById(req.params.id, (err, data) => {
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
                    message: "Producto no encontrado"
                }
            });
        }
        data.nombre = req.body.nombre;
        data.precioUni = req.body.precioUni;
        data.descripcion = req.body.descripcion;
        data.disponible = req.body.disponible;
        data.categoria = req.body.categoria;

        data.save((err, dataGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                producto: dataGuardado
            });
        });
    });


});

app.delete('/producto/:id', verficaToken, (req, res) => {
    Producto.findById(req.params.id, (err, data) => {
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
                    message: "Producto no encontrado"
                }
            });
        }

        data.disponible = false;


        data.save((err, dataGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                producto: dataGuardado,
                message: 'Producto eliminado'
            });
        });
    });
});

module.exports = app;