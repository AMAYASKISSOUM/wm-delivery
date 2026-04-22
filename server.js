//Doit etre en debut de fichier pour charger les variables d'environnement
import "dotenv/config";

//importer les routes
import routerExterne from "./routes.js";

// Importation des fichiers et librairies
import { engine } from "express-handlebars";
import express, { json } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import memorystore from "memorystore";
import passport from "passport";
import "./auth.js"; // Importer le fichier d'authentification pour configurer Passport
import sse from "./middlewares/sse.js";
import https from "node:https";
import { readFile } from "node:fs/promises";

// Crréation du serveur express
const app = express();
app.engine("handlebars", engine()); //Pour informer express que l'on utilise handlebars
app.set("view engine", "handlebars"); //Pour dire a express que le moteur de rendu est handlebars
app.set("views", "./views"); //Pour dire a express ou se trouvent les vues

//Creation du store de session en mémoire
const MemoryStore = memorystore(session);

// Ajout de middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(json());

// Middleware pour gérer les connexions SSE
app.use(sse());

// Configuration de la session
app.use(
    session({
        cookie: { maxAge: 3600000 }, // Durée de vie du cookie de session (1 heure)
        name: process.env.npm_package_name,
        store: new MemoryStore({ checkPeriod: 3600000 }),
        resave: false,
        saveUninitialized: false,
        rolling: true,
        secret: process.env.SESSION_SECRET,
    })
);

// Initialisation de Passport pour la gestion de l'authentification
app.use(passport.initialize());
app.use(passport.session());

//Middeleware integre a express pour gerer la partie static du serveur
//le dossier 'public' est la partie statique de notre serveur
app.use(express.static("public"));

// Ajout des routes
app.use(routerExterne);

// Renvoyer une erreur 404 pour les routes non définies
app.use((request, response) => {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(`${request.originalUrl} Route introuvable.`);
});

//Démarrage du serveur
console.log("Serveurs démarré:");
if (process.env.NODE_ENV === "production") {
    app.listen(process.env.PORT);
    console.log("http://localhost:" + process.env.PORT);
} else {
    const credentials = {
        key: await readFile("./security/localhost.key"),
        cert: await readFile("./security/localhost.cert"),
    };

    https.createServer(credentials, app).listen(process.env.PORT);
    console.log("https://localhost:" + process.env.PORT);
}
