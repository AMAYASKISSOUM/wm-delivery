import { isDescriptionValid as isDescriptionValidClient } from "../public/validation.js";

// Middleware de validation pour la description d'une tâche
//Le premier est la requête, le second est la réponse et le troisième est la fonction next qui permet de passer au middleware suivant si la validation est réussie
function isDescriptionValid(request, response, next) {
    if (isDescriptionValidClient(request.body.description)) {
        return next();
    }

    response.status(400).json("Mefie toi!");
}

export { isDescriptionValid };
