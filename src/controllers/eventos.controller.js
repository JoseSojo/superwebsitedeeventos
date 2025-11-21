import { Router } from 'express';
import { createEvento, deleteEventos, getEventoById, getEventos, updateEvento, addCategoria } from '../models/eventos.js';
import { getPerson } from '../models/person.js';
import { getCategoria } from '../models/categoria.js';
import { parse } from 'dotenv';

const router = Router();

router.get('/', async (req, res) => {
    const query = req.query;

    const lista = await getEventos(query.param);
    const responsables = await getPerson();
    const categorias = await getCategoria();
    res.render('evento/list', { lista, responsables, categorias });
});

router.get('/evento/:id', async (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const dispositivo = req.get('User-Agent'); // Navegador, SO, dispositivo
    const metodo = req.method; // POST
    const url = req.originalUrl; // La ruta llamada

    // Log para ver la info en consola
    console.log('--- Nuevo Request ---');
    console.log(`IP: ${ip}`);
    console.log(`Dispositivo: ${dispositivo}`);
    console.log(`Info Extra: ${metodo} en ${url}`);


    const evento = await getEventoById(req.params.id); // esperar -> 0.5 milisegundos 
    const categorias = await getCategoria();

    res.render('evento/show', { evento, categorias });
});

router.post('/', async (req, res) => {
    const evento = req.body;
    await createEvento({
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        capacidad: parseInt(evento.capacidad),
        tipo: evento.tipo,
        lugar: evento.lugar,
        fechaInicio: new Date(evento.fechaInicio),
        fechaFin: new Date(evento.fechaFin),
        responsableId: parseInt(evento.responsableId),
        categoriaId: parseInt(evento.categoriaId),
    });
    res.redirect('/');
});

router.post('/:id/update', async (req, res) => {
    const categoria = req.body;
    await updateEvento({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        capacidad: parseInt(categoria.capacidad),
        tipo: categoria.tipo,
        lugar: categoria.lugar,
        fechaInicio: new Date(categoria.fechaInicio),
        fechaFin: new Date(categoria.fechaFin),
    }, parseInt(req.params.id));
    res.redirect('/categoria');
});

router.post('/add/categoria/:id', async (req, res) => {
    const idEvento = req.params.id;
    const categoriaId = req.body.categoriaId;

    console.log(idEvento, categoriaId);

    await addCategoria(parseInt(idEvento), parseInt(categoriaId));
    res.redirect(`/evento/${idEvento}`);
});

router.post('/:id/delete', async (req, res) => {
    await deleteEventos(req.params.id);
    res.redirect('/evento');
})

export default router;