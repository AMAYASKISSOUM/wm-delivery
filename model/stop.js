import { prisma } from "../lib/prisma.js";

const getStops = async () => await prisma.stop.findMany({
    include: { route: true }
});

const getStopsByRoute = async (routeId) => await prisma.stop.findMany({
    where: { routeId },
    orderBy: { ordre: "asc" }
});

const addStop = async (adresse, ordre, routeId) => {
    return await prisma.stop.create({
        data: { adresse, ordre, routeId }
    });
};

const deleteStop = async (id) => {
    return await prisma.stop.delete({ where: { id } });
};

export { getStops, getStopsByRoute, addStop, deleteStop };