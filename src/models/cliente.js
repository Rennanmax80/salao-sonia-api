const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cliente = new Schema({
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    foto: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['A', 'I', 'E'],
        default: 'A',
    },
    sexo: {
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    status: {
        type: String,
        enum: ['A', 'I'],
        required: true,
        default: 'A'
    },
    documento: {
        tipo: {
            type: String,
            enum: ['cpf', 'cnpj'],
            required: true,
        },
        numero: {
            type: String,
            required: true,
        },
    },
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String,
    },

    dataCadastro: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Cliente', cliente);