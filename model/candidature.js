import { prisma } from "../lib/prisma.js";

const getCandidatures = async () => await prisma.candidature.findMany({
    orderBy: { createdAt: "desc" }
});

const addCandidature = async (nom, email, cv) => {
    return await prisma.candidature.create({
        data: { nom, email, cv }
    });
};

const updateStatutCandidature = async (id, statut) => {
    return await prisma.candidature.update({
        where: { id },
        data: { statut }
    });
};

export { getCandidatures, addCandidature, updateStatutCandidature };