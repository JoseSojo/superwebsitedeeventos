// IMPORTS
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';

// ---- PASSPORT ----
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import { isLoggedIn } from './utils/auth.js'; // Validador de sesiones
// ---- PASSPORT ----

// IMPORTAR RUTAS
import personaController from './controllers/persona.controller.js'; 
import categoriaController from './controllers/categoria.controller.js'; 
import eventosController from './controllers/eventos.controller.js'; 
// ---- CONTROLADORES DE SESIÓN ----
import authController from './controllers/auth.controller.js'; 

// ---- IMPORTAR PASSPORT
import './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ------ MORGAN ------
app.use(morgan('dev')); 
// ------ CODIFICACIONES ------
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN DE SESIÓN (OBLIGATORIO) ---
app.use(session({
    secret: 'token', // Cambia esto por una variable de entorno
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// ------ MOTOR DE PLANTILLAS ------ handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'), // Ahora __dirname sí funcionará
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// --- VARIABLES GLOBALES ---
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.message = req.flash('message'); // Si usas flash
    next();
});
// --- VARIABLES GLOBALES ---


// ------ CONTROLADORES ------
app.use('/person', personaController);
app.use('/categoria', categoriaController);
app.use('/eventos', isLoggedIn, eventosController);
app.use('/', authController);

// SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor web en el puerto ${PORT}!`));
