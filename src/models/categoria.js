import prisma from '../config/db.js';

function format(objeto) {
    return {
        nombre: objeto.nombre,
        descripcion: objeto.descripcion,
        id: objeto.id,
        _count: objeto._count,
        eventos: objeto.eventos,
    }
}

export async function getCategoria() {
    const categorias = await prisma.categoria.findMany({
        include: {
            _count: {
                select: {
                    eventos: true,
                }
            }
        }
    });
    return categorias.map((categoria) => format(categoria));
}

export async function getCategoriaById(id) {
    const categoria = await prisma.categoria.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            _count: true,
            eventos: {
                include: {
                    evento: {
                        include: {
                            responsable: true,
                        }
                    }
                }
            },
        }
    });
    return format(categoria);
}

export async function createCategoria(categoria) {
    await prisma.categoria.create({
        data: {
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
        }
    });
}

export async function updateCategoria(categoria, id) {
    await prisma.categoria.update({
        where: {
            id
        },
        data: {
            nombre: categoria.nombre,
            descrip: categoria.descrip,
        }
    });
}

export async function deleteCategoria(id) {
    await prisma.categoria.delete({
        where: {
            id: parseInt(id)
        }
    });
}
