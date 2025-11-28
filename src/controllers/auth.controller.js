import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
// Asegúrate de poner la extensión .js en los imports locales en ES Modules
import prisma from '../config/db.js';
import { getPublicEvent, getEventoById } from '../models/eventos.js';
import { getCategoria } from '../models/categoria.js';
import { mostrarPortafolio } from '../models/person.js';
import { crearSembrado } from '../models/base.js';

const router = Router();

// Muestra la página principal
router.get('', async (req, res) => {

    const categoriaId = req.query.categoriaId ? parseInt(req.query.categoriaId) : null;
    const param = req.query.param ? req.query.param : '';
    const skip = req.query.skip ? parseInt(req.query.skip) : 0; // cuantos a ignorar
    const take = req.query.take ? parseInt(req.query.take) : 5; // cuantos a mostrar

    const eventos = await getPublicEvent(param, skip, take, categoriaId);
    const categorias = await getCategoria();

    return res.render('page', { eventos, skip: skip + take, take, param, categorias });
})

router.get('/unico-evento/:id', async (req, res) => {
    const evento = await getEventoById(parseInt(req.params.id));
    return res.render('evento', { evento });
})

router.get('/unico-portafolio/:id', async (req, res) => {
    const person = await mostrarPortafolio(req.params.id);
    return res.render('portafolio', person);
})


// Muestra la pagina del login
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Procesa el login
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/eventos',
    failureRedirect: '/login',
    failureFlash: true
}));

// Muestra la pagina de registro
router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body; // Nombre no es obligatorio
    try {
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(password, hashedPassword);

        await prisma.persona.create({
            data: {
                email,
                password: hashedPassword,
                nombre: name
            }
        });
        return res.redirect('/login');
    } catch (error) {
        console.error('Error en registro:', error);
        // Sugerencia: Enviar un mensaje de error si el correo ya existe
        res.redirect('/register');
    }
});

// Cerrar Sesión
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

router.get('/crearmucho', async (req, res) => res.send(await crearSembrado()));

export default router;