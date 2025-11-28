import prisma from '../config/db.js'; 
import bcrypt from 'bcryptjs';

// Arrays de datos semilla para generar combinaciones aleatorias
const nombresEventos = ["Conferencia", "Taller", "Seminario", "Curso", "Festival", "Congreso", "Reunión", "Charla", "Hackathon", "Torneo"];
const adjetivos = ["Tecnológico", "Anual", "Internacional", "Local", "Creativo", "Avanzado", "para Principiantes", "Exclusivo", "Benéfico", "de Verano"];
const temas = ["Javascript", "IA", "Salud", "Música", "Arte", "Negocios", "Cripto", "Medicina", "Deportes", "Cocina"];

const nombresPersonas = ["Ana", "Carlos", "Juan", "Maria", "Pedro", "Sofia", "Lucia", "Miguel", "David", "Elena"];
const apellidos = ["Perez", "Gomez", "Rodriguez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Garcia", "Torres", "Ramirez"];

// Helper para obtener elemento random
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export async function crearSembrado() {
    try {
        console.log("🌱 Iniciando sembrado masivo de datos...");
        const startTime = Date.now();

        // 1. Crear 50 Categorías
        // -------------------------------------------------
        const categoriasIds = [];
        console.log("... Creando 50 categorías");
        
        for (let i = 0; i < 50; i++) {
            const nombreCat = `${getRandom(temas)} ${getRandom(adjetivos)} ${i}`; // Agregamos i para asegurar unicidad si es unique
            const cat = await prisma.categoria.create({
                data: {
                    nombre: nombreCat,
                    descripcion: `Descripción generada para la categoría ${nombreCat}`
                }
            });
            categoriasIds.push(cat.id);
        }

        // 2. Crear 20 Personas (Responsables)
        // -------------------------------------------------
        const responsablesIds = [];
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('123456', salt); // Contraseña genérica para todos
        
        console.log("... Creando 20 personas");

        for (let i = 0; i < 20; i++) {
            const nombre = getRandom(nombresPersonas);
            const apellido = getRandom(apellidos);
            const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@test.com`; // Email único

            const persona = await prisma.persona.create({
                data: {
                    nombre: `${nombre} ${apellido}`,
                    email: email,
                    password: passwordHash
                }
            });
            responsablesIds.push(persona.id);
        }

        // 3. Crear 30 Eventos
        // -------------------------------------------------
        console.log("... Creando 30 eventos con relaciones");
        
        for (let i = 0; i < 30; i++) {
            // Fechas aleatorias (Inicio en los próximos 30 días, Fin 2-10 horas después)
            const hoy = new Date();
            const fechaInicio = new Date(hoy.setDate(hoy.getDate() + getRandomInt(1, 60)));
            const fechaFin = new Date(fechaInicio.getTime() + getRandomInt(2, 10) * 60 * 60 * 1000);

            const nuevoEvento = await prisma.evento.create({
                data: {
                    nombre: `${getRandom(nombresEventos)} ${getRandom(temas)} ${getRandom(adjetivos)}`,
                    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    capacidad: getRandomInt(50, 500),
                    lugar: `Sala ${getRandomInt(1, 20)} - Edificio ${getRandom(["A", "B", "C"])}`,
                    tipo: getRandom(["Publico", "Privado", "Benefico"]),
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    responsableId: getRandom(responsablesIds) // Asignar responsable aleatorio
                }
            });

            // 4. Asignar Categorías (3 a 5 por evento)
            // -------------------------------------------------
            const numCategorias = getRandomInt(3, 5);
            
            // Mezclar array de IDs de categorías y tomar los primeros N
            const categoriasMezcladas = categoriasIds.sort(() => 0.5 - Math.random());
            const categoriasSeleccionadas = categoriasMezcladas.slice(0, numCategorias);

            // Crear las relaciones en la tabla intermedia
            const promesasCategorias = categoriasSeleccionadas.map(catId => {
                return prisma.eventoCategorias.create({
                    data: {
                        eventoId: nuevoEvento.id,
                        categoriaId: catId
                    }
                });
            });

            await Promise.all(promesasCategorias);
        }

        const duration = (Date.now() - startTime) / 1000;
        return `
            <h1>✅ Sembrado Completado</h1>
            <p>Se han creado:</p>
            <ul>
                <li>50 Categorías</li>
                <li>20 Personas (Password: 123456)</li>
                <li>30 Eventos</li>
                <li>~120 Relaciones Evento-Categoría</li>
            </ul>
            <p>Tiempo total: ${duration} segundos.</p>
            <a href="/eventos">Ir a la lista de eventos</a>
        `;

    } catch (error) {
        console.error(error);
        return `<h1>Error al crear datos</h1><pre>${error.message}</pre>`;
    }
}
