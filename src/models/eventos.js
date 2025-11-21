import prisma from '../config/db.js';

function format(objeto) {
    return {
        nombre: objeto.nombre, //
        descripcion: objeto.descripcion, //
        id: objeto.id,
        capacidad: objeto.capacidad, // 
        tipo: objeto.tipo,
        lugar: objeto.lugar, //
        fechaInicio: objeto.fechaInicio, //
        fechaFin: objeto.fechaFin, //
        responsableId: objeto.responsableId,
        categorias: objeto.categorias,
        responsable: objeto.responsable,
    }
}

export async function getEventos(param) {
    const eventos = await prisma.evento.findMany({
        include: {
            categorias: true,
            responsable: true,
        },
        where: {
            nombre: { startsWith: param }
        }
    });
    return eventos.map((evento) => format(evento));
}

export async function getEventoById(id) {
    const evento = await prisma.evento.findUnique({
        where: { id: parseInt(id) },
        include: {
            categorias: {
                include: {
                    categoria: true
                }
            },
            responsable: true,
        }
    });
    return format(evento);
}

export async function createEvento(evento) {
    await prisma.evento.create({
        data: {
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            capacidad: evento.capacidad,
            tipo: evento.tipo,
            lugar: evento.lugar,
            fechaInicio: evento.fechaInicio,
            fechaFin: evento.fechaFin,
            responsable: { connect: { id: evento.responsableId } },
            categorias: {
                create: {
                    categoria: { connect: { id: evento.categoriaId } }
                }
            }
        }
    });
}

export async function updateEvento(categoria, id) {
    await prisma.evento.update({
        where: {
            id
        },
        data: {
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            capacidad: evento.capacidad,
            tipo: evento.tipo,
            lugar: evento.lugar,
            fechaInicio: evento.fechaInicio,
            fechaFin: evento.fechaFin,
        }
    });
}

export async function addCategoria(idEvento, idCategoria) {
    await prisma.evento.update({
        where: {
            id: idEvento
        },
        data: {
            categorias: {
                create: {
                    categoria: { connect: { id: idCategoria } }
                }
            }
        }
    });
}

export async function deleteEventos(id) {
    await prisma.evento.delete({
        where: {
            id: parseInt(id)
        }
    });
}
