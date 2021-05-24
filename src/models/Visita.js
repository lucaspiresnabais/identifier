const mongoose = require('mongoose');


const visitaSchema = new mongoose.Schema({
    idVisitador: {
        type: mongoose.Schema.Types.ObjectId,
    },
    idReceptor: {
        type: mongoose.Schema.Types.ObjectId,
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