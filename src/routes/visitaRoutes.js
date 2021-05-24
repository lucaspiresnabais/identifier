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
        console.log(err)
        res.status(422).send({error: "An error has occurred"});
    }
})

router.get('/link/:idVisita', async (req, res) => {
    const { idVisita } = req.params;
    try { 
        const visita = await Visita.findById(idVisita)
        
        if (!visita) {
            return res.status(400).send({error: "La visita no existe"})
        }

        res.send(`host/pages/scanner/${idVisita}`)
    } catch (err) {
        console.log(err)
        res.status(422).send({error: "An error has occurred"});
    }
})


router.post('/addVisita', async (req, res) => {

    const { idVisitador, idReceptor, diaHoraDesde, diaHoraHasta } = req.body;
    const estado = 'No habilitado';
   
    if (!req.body.idReceptor) {
        return res.status(400).send({error: 'idVisitador es obligatorio'});
    }
    
    if (!req.body.diaHoraDesde || !req.body.diaHoraHasta) {
        return res.status(400).send({error: 'diaHoraDesde y diaHoraHasta son obligatorios'});
    }
    
    if (idVisitador) {
        estado = 'Habilitado'
    }

    try {
        const visita = new Visita({idVisitador, idReceptor, diaHoraDesde, diaHoraHasta, estado});
        await visita.save();

        res.send(`Se ha agregado la visita: ${visita}`)
    } catch (err) {
        console.log(err)
        res.status(422).send({error: "An error has occurred"});
    }
});

router.patch('/addVisitador/:idVisita', async (req, res) => {
    const { idVisitador } = req.body;
    const { idVisita } = req.params
    
    if (!idVisitador) {
       return res.status(400).send({error: 'idVisitador es obligatorio'});
    }

    try {
        const visita = await Visita.findById(idVisita)


        if (visita.idVisitador) {
            return res.status(400).send({error: 'La visita ya posee un visitador'})
        }

        if (visita.estado != 'No habilitado') {
            return res.status(400).send({error: `La visita se encuentra en estado ${visita.estado}`})
        }

        visita.idVisitador = idVisitador;
        visita.estado = 'Habilitado';
        await visita.save()
        res.send(visita)
    } catch (err) {
        console.log(err)
        res.status(422).send({error: "An error has occurred"});
    }
})

router.patch('/validateVisita/:idVisita', async (req, res) => {

    const { idVisitador, geo } = req.body
    const { idVisita } = req.params

    if(!idVisitador) {
        return res.status(400).send({error: 'El idVisitador es obligatorio'});
    }

    try {
        const visita = await Visita.findById(idVisita)
        
        if(!visita) {
            return res.status(404).send({error: 'Visita no encontrada'})
        }

        if (!visita.idVisitador || visita.estado !== 'Habilitado') {
            return res.status(422).send({error: 'La visita no está en estado "Habilitado" o no tiene idVisitador'})
        }

        if (visita.idVisitador != idVisitador) {
            return res.status(400).send({error: 'El visitador no es el indicado!'})
        }

        visita.estado = "Ejecutado";
        visita.geo = geo;
        await visita.save();
        res.send(visita);
    }catch(err) {
        console.log(err);
        res.status(422).send({error: "An error has occurred"});
    }
})

module.exports = router;

