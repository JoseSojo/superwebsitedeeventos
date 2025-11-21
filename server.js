// IMPORTS
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';

// IMPORTAR RUTAS
import personaController from './src/controllers/persona.controller.js'; 
import categoriaController from './src/controllers/categoria.controller.js'; 
import eventosController from './src/controllers/eventos.controller.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ------ MORGAN ------
app.use(morgan('dev')); 

// ------ CODIFICACIONES ------
app.use(express.urlencoded({ extended: true }));

// ------ MOTOR DE PLANTILLAS ------ handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'), // Ahora __dirname sí funcionará
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// ------ CONTROLADORES ------

// app.use('/', eventonController);
//       /person
app.use('/person', personaController);
app.use('/categoria', categoriaController);
app.use('/', eventosController);

// SERVIDOR
app.listen(3000, () => console.log('Servidor web en el puerto 3000!'));
