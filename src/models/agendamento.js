const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const agendamento = new Schema({
    salaoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Salao',
        required: true
    },
    clienteId: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },   
    servicoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Servico',
        required: true
    },   
    colaboradorId: {
        type: mongoose.Types.ObjectId,
        ref: 'Colaborador',
        required: true
    },   
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
    data: {
        type: Date,
        default: Date.now,
    },
    dataCadastro: {
        type: Date,
        required: true
    },
    comissao: {
        type: Number,
        required: true,
    },
    valor: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    valor: {
        type: Number,
        required: true,
    },
});






module.exports = mongoose.model('Agendamento', agendamento);