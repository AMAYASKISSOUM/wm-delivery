# Ressources

- [Prisma ORM - Quickstart](https://www.prisma.io/docs/prisma-postgres/quickstart/prisma-orm)
- [Prisma Schema - Data Models](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
- [Prisma Schema - Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)

# Définitions

- Prisma un un ORM
- ORM (Object-Relational Mapping) : Technique permettant de simplifier l'interaction avec la base de données en permettant aux développeurs de manipuler les données comme des objets au lieu d'écrire directement des requêtes SQL.

# Avantages des ORM

- Abstraction SQL : Pas besoin d’écrire des requêtes SQL complexes, l’ORM génère automatiquement le SQL nécessaire.
- Sécurité : Protège contre les injections SQL en gérant correctement les entrées utilisateur.
- Productivité : Permet d’écrire moins de code et de se concentrer sur la logique métier.
- Portabilité : Rend le code plus indépendant du type de base de données (ex : passer de SQLite à PostgreSQL est plus simple).
- Gestion automatique : Facilite les migrations de base de données et les relations entre les tables.

# Installations

- npm install prisma @types/node @types/better-sqlite3 -D
- npm install @prisma/client @prisma/adapter-better-sqlite3

## Explications

- prisma - L'interface de ligne de commande Prisma pour exécuter des commandes comme prisma init, prisma migrate et prisma generate
- @prisma/client - La bibliothèque Prisma Client pour interroger votre base de données
- @prisma/adapter-better-sqlite3 - L'adaptateur de pilote SQLite qui connecte Prisma Client à votre base de données
- @types/better-sqlite3 - Les définitions de types TypeScript pour better-sqlite3

# Initialiser Prisma ORM

- npx prisma init --datasource-provider sqlite --output ../generated/prisma
- Personnalisé le nom de la BD dans .env

## Explications

Cette commande fait plusieurs choses :

- Crée un répertoire `prisma/` avec un fichier `schema.prisma` contenant votre connexion à la base de données et vos modèles de schéma
- Crée un fichier `.env` à la racine du projet pour les variables d'environnement s'il n'existe pas
- Crée un fichier `prisma.config.ts` pour la configuration de Prisma

# Définir votre modèle de données

Ouvrez `prisma/schema.prisma` et ajoutez les modèles suivants pour votre application todo :

```prisma
model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    name  String?
    role String
    tasks Task[]
}

model Task {
    id          Int     @id @default(autoincrement())
    description String
    completed   Boolean @default(false)
    author      User    @relation(fields: [authorId], references: [id])
    authorId    Int
}
```

# Créer et appliquer votre première migration

## Créer les tables de la base de données selon votre schéma

- `npx prisma migrate dev --name init`

**Note :** Cette commande crée les tables de la BD. À chaque modification du schéma, exécutez `npx prisma migrate dev --name nom_migration` pour appliquer les modifications.

## Générer le Prisma Client

- `npx prisma generate`

## Visualiser la base de données SQLite

Installez SQLite Studio ou utilisez la commande :

- `npx prisma studio`

# Instancier Prisma Client

- Creer un fichier /lib/prisma.js et y ajouter le code suivant

```
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

```

- Utiliser prisma dans le model : Importer prisma du lib et l'utiliser
