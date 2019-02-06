const jwt = require('jsonwebtoken');

let verficaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEDD, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

let verficaAdmin = (req, res, next) => {


    if (req.usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'usuario no autorizado '
            }
        });
    }

};

module.exports = {
    verficaToken,
    verficaAdmin
}