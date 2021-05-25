const mongoose = require('mongoose');


const visitaSchema = new mongoose.Schema({
    idVisitador: {
        type: String,
    },
    mailVisitador: {
        type: String,
    },
    tipoDni: {
        type: String,
    },
    nroDni: {
        type: String,
    },
    nombre: {
        type: String,
    },
    mailReceptor: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
    diaHoraDesde: {
        type: Number,
    },
    diaHoraHasta: {
        type: Number,
    },
    estado: {
        type: String,
    },
})

mongoose.model('Visita', visitaSchema)