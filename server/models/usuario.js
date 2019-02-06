const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email es requerido']
    },
    password: {
        type: String,
        required: [true, 'password es requerido']
    },
    img: {
        type: String,
        required: false //es opcional
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

//en éste método no es recomendable usar la función de flecha =>
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe un usuario con el email proporcionado' });

module.exports = mongoose.model('Usuario', usuarioSchema);