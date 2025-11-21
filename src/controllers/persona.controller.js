import { Router } from 'express';
import { getPerson, createPerson, updatePerson, deletePerson, getPersonById } from '../models/person.js';

const router = Router();

router.get('/', async (req, res) => {
    const lista = await getPerson();
    console.log(lista);
    res.render('person/list', { lista });
});

router.get('/:id', async (req, res) => {
    const persona = await getPersonById(req.params.id); // esperar -> 0.5 milisegundos 
    res.render('person/show', { persona });
});

router.post('/', async (req, res) => {
    const persona = req.body;
    await createPerson({
        nombre: persona.nombre,
        email: persona.email,
    });
    res.redirect('/person');
});

router.post('/:id/update', async (req, res) =>{
    const persona = req.body;
    await updatePerson({
        nombre: persona.nombre,
        email: persona.email,
    }, parseInt(req.params.id));
    res.redirect('/person');
});

router.post('/:id/delete', async (req, res) => {
    await deletePerson(req.params.id);
    res.redirect('/person');
})

export default router;