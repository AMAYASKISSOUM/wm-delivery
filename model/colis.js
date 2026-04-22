import { prisma } from "../lib/prisma.js";

const getColis = async () => await prisma.colis.findMany({
    include: { livreur: true, stop: true }
});

const getColisByLivreur = async (livreurId) => await prisma.colis.findMany({
    where: { livreurId },
    include: { stop: true }
});

const addColis = async (description, livreurId = null, stopId = null) => {
    return await prisma.colis.create({
        data: { description, livreurId, stopId }
    });
};

const updateStatutColis = async (id, statut, causeRetour = null) => {
    return await prisma.colis.update({
        where: { id },
        data: { statut, causeRetour }
    });
};

const deleteColis = async (id) => {
    return await prisma.colis.delete({ where: { id } });
};

export { getColis, getColisByLivreur, addColis, updateStatutColis, deleteColis };