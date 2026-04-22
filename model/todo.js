//Importation du client prisma
import { prisma } from "../lib/prisma.js";

//Liste des todos
const todos = [];

/** * Fonction pour ajouter une tâche
 * @param {string} description
 * @returns {object} Tâche ajoutée
 */
const addTodo = async (description, auteurId) => {
    const task = {
        description,
        auteurId,
    };

    const todo = await prisma.task.create({
        data: task,
    });
    return todo;
};

/** * Fonction pour obtenir toutes les tâches
 * @returns {array} Liste des tâches
 */
const getTodos = async () => await prisma.task.findMany();

/**
 *Fonction pour mettre à jour une tâche
 * @param {number} id
 * @returns {object} Tâche mise à jour
 */
const updateTodo = async (id) => {
    //verifier l'existance de la tache
    const todo = await prisma.task.findUnique({
        where: { id },
    });

    if (!todo) {
        throw new Error("Tâche non trouvée");
    }

    //mettre a jour la tache
    const updatedTodo = await prisma.task.update({
        where: { id },
        data: { completed: !todo.completed },
    });
    return updatedTodo;
};

/**
 *Fonction pour supprimer une tâche
 * @param {number} id
 * @returns {object} Tâche supprimée
 */
const deleteTodo = async (id) => {
    //verifier l'existance de la tache
    const todo = await prisma.task.findUnique({
        where: { id },
    });

    if (!todo) {
        throw new Error("Tâche non trouvée");
    }
    //supprimer la tache
    const deletedTodo = await prisma.task.delete({
        where: { id },
    });
    return deletedTodo;
};

export { addTodo, getTodos, updateTodo, deleteTodo };
