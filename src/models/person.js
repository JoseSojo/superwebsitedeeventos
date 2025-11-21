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

// export {
//     getPerson, 
//     getPersonById, 
//     createPerson,
// }
