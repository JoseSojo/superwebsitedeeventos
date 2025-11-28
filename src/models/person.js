import prisma from '../config/db.js';

function format(objeto) {
    return {
        nombre: objeto.nombre,
        email: objeto.email,
        id: objeto.id,
    }
}

export async function getPerson() {
    const persons = await prisma.persona.findMany();
    return persons.map((person) => format(person));
}

export async function getPersonById(id) {
    const person = await prisma.persona.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    return format(person);
}

export async function createPerson(persona) {
    await prisma.persona.create({
        data: {
            nombre: persona.nombre,
            email: persona.email,
        }
    });
}

export async function updatePerson(persona, id) {
    await prisma.persona.update({
        where: {
            id
        },
        data: {
            nombre: persona.nombre,
            email: persona.email,
        }
    });
}

export async function deletePerson(id) {
    await prisma.persona.delete({
        where: {
            id: parseInt(id)
        }
    });
}

export const mostrarPortafolio = async (id) => {

    const organizador = await prisma.persona.findUnique({
        where: { id: parseInt(id) },
        include: {
            eventos: {
                include: {
                    categorias: { include: { categoria: true } }
                },
                orderBy: { fechaInicio: 'desc' } // Los más recientes primero
            }
        }
    });

    // Calcular estadísticas simples para el dashboard del perfil
    const totalEventos = organizador.eventos.length;
    const eventosActivos = organizador.eventos.filter(e => new Date(e.fechaFin) > new Date()).length;
    const capacidadTotalGestionada = organizador.eventos.reduce((acc, curr) => acc + curr.capacidad, 0);

    return {
        organizador,
        stats: { totalEventos, eventosActivos, capacidadTotalGestionada }
    }
};

// export {
//     getPerson, 
//     getPersonById, 
//     createPerson,
// }
