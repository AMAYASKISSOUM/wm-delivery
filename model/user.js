//Importation du client prisma
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

/**
 * Pour ajouter un utilisateur
 * @param {*} email
 * @param {*} password
 * @param {*} name
 * @param {*} role
 * @returns l'utilisateur ajouté
 */
const addUser = async (email, password, name, role = "user") => {
    const userTodAdd = {
        email,
        name,
        role,
        password: await bcrypt.hash(password, 10),
    };
    const user = await prisma.user.create({
        data: userTodAdd,
    });
    console.log("Utilisateur ajouté : ", user);
    return user;
};

/**
 * Pour récupérer un utilisateur par son email
 * @param {*} email
 * @returns l'utilisateur trouvé ou null
 */
const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
};

/**
 * Pour récupérer un utilisateur par son id
 * @param {*} id
 * @returns l'utilisateur trouvé ou null
 */
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });
    return user;
};

export { addUser, getUserByEmail, getUserById };
