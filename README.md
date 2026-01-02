# Next.js + Prisma Task Manager

Une application moderne de gestion de tâches construite avec Next.js et Prisma.

## 🚀 Stack Technique

- **Framework**: [Next.js](https://nextjs.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Base de données**: SQLite
- **Stylage**: Tailwind CSS

## 🛠️ Installation

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer la base de données** :
   ```bash
   npx prisma db push
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

## 🗄️ Prisma CLI

Voici les commandes essentielles pour gérer votre base de données :

- `npx prisma generate` : Génère le client Prisma.
- `npx prisma db push` : Synchronise le schéma avec SQLite.
- `npx prisma studio` : Interface graphique pour visualiser vos données.
- `npx prisma migrate dev` : Crée une migration (pour la production).

## 📝 Modèle de Données

Le modèle `Task` est défini comme suit :
- `id`: Integer (Auto-increment)
- `content`: String
- `createAt`: DateTime
- `completed`: Boolean

## 🌐 Déploiement

Le moyen le plus simple de déployer votre application est d'utiliser la plateforme [Vercel](https://vercel.com/new).
