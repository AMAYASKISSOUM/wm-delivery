import { prisma } from "../lib/prisma.js";

const getPaiements = async () => await prisma.paiement.findMany({
    include: { livreur: true }
});

const getPaiementsByLivreur = async (livreurId) => await prisma.paiement.findMany({
    where: { livreurId },
    orderBy: { createdAt: "desc" }
});

const addPaiement = async (montant, livreurId, periode) => {
    return await prisma.paiement.create({
        data: { montant, livreurId, periode }
    });
};

export { getPaiements, getPaiementsByLivreur, addPaiement };