import { Router } from 'express';
import { createCategoria,deleteCategoria,getCategoria,getCategoriaById,updateCategoria } from '../models/categoria.js';

const router = Router();

router.get('/', async (req, res) => {
    const lista = await getCategoria();
    console.log(lista);
    res.render('categoria/list', { lista });
});

router.get('/:id', async (req, res) => {
    const categoria = await getCategoriaById(req.params.id); // esperar -> 0.5 milisegundos 
    console.log(categoria);
    res.render('categoria/show', { categoria });
});

router.post('/', async (req, res) => {
    const categoria = req.body;
    await createCategoria({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
    });
    res.redirect('/categoria');
});

router.post('/:id/update', async (req, res) =>{
    const categoria = req.body;
    await updateCategoria({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
    }, parseInt(req.params.id));
    res.redirect('/categoria');
});

router.post('/:id/delete', async (req, res) => {
    await deleteCategoria(req.params.id);
    res.redirect('/categoria');
})

export default router;