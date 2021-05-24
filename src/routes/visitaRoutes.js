const express = require('express');
const mongoose = require('mongoose');
const Visita = mongoose.model('Visita');
const router = express.Router();

router.get('/:idVisita', async (req, res) => {
    const { idVisita } = req.params
    try { 
        const visita = await Visita.findById(idVisita)
        res.send(visita)
    } catch (err) {
        res.status(422).send({error: "An error has occurred"});
        console.log(err)
    }
})

router.post('/addVisita', async (req, res) => {

    const { idVisitador, idReceptor, diaHoraDesde, diaHoraHasta, estado } = req.body;
   
    if (!req.body.idReceptor) {
        return res.status(400).send({error: 'idVisitador es obligatorio'});
    }
    
    if (!req.body.diaHoraDesde || !req.body.diaHoraHasta) {
        return res.status(400).send({error: 'diaHoraDesde y diaHoraHasta son obligatorios'});
    }
    
    if (!req.body.estado) {
        return res.status(400).send({error: 'El estado es obligatorio'});
    }

    try {
        const visita = new Visita({idVisitador, idReceptor, diaHoraDesde, diaHoraHasta, estado});
        await visita.save();

        res.send(`Se ha agregado la visita: ${visita}`)
    } catch (err) {
        res.status(422).send({error: "An error has occurred"});
        console.log(err)
    }
});

router.patch('/addVisitador/:idVisita', async (req, res) => {
    const { idVisitador, geo } = req.body;
    const { idVisita } = req.params
    
    if (!idVisitador) {
        res.status(400).send({error: 'idVisitador es obligatorio'});
    }

    try {
        const visita = await Visita.findById(idVisita)


        if (visita.idVisitador) {
            res.status(400).send({error: 'La visita ya posee un visitador'})
        }

        if (visita.estado != 'No habilitado') {
            res.status(400).send({error: `La visita se encuentra en estado ${visita.estado}`})
        }

        visita.idVisitador = idVisitador;
        visita.geo = geo;
        visita.estado = 'Habilitado';
        await visita.save()
        res.send(visita)
    } catch (err) {
        res.status(422).send({error: "An error has occurred"});
        console.log(err)
    }
})

router.post('/validarVisita', (req, res) => {
    
    if(!req.body.idVisitador) {
        return res.status(400).send({error: 'El idVisitador es obligatorio'});
    }

    res.send(`Validada`);
})

module.exports = router;

