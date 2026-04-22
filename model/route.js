import { prisma } from "../lib/prisma.js";

const getRoutes = async () => await prisma.route.findMany({
    include: { stops: true }
});

const addRoute = async (nom) => {
    return await prisma.route.create({ data: { nom } });
};

const updateRoute = async (id, data) => {
    return await prisma.route.update({ where: { id }, data });
};

const deleteRoute = async (id) => {
    return await prisma.route.delete({ where: { id } });
};

export { getRoutes, addRoute, updateRoute, deleteRoute };