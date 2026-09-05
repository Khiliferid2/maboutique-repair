# MaBoutique Repair

SaaS de gestion pour ateliers de réparation de smartphones et d'électronique
(clients, appareils, IMEI, réparations, garanties, stock, factures).

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** (couleurs de la marque déjà configurées)
- **Prisma** + **SQLite** (facile à remplacer par PostgreSQL en production)
- Authentification maison (cookie de session signé, mot de passe hashé avec bcrypt)

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier d'environnement
cp .env.example .env

# 3. Créer la base de données SQLite et générer le client Prisma
npx prisma migrate dev --name init

# 4. Lancer le serveur de développement
npm run dev
```

Le site est ensuite accessible sur http://localhost:3000

## Deux volets de l'application

### 1. Gestion interne (dashboard privé, protégé par connexion)

1. Ouvrez `/register` → créez votre boutique (crée aussi votre compte admin
   et vous connecte automatiquement).
2. Vous êtes redirigé vers `/dashboard`.
3. Ajoutez un **client** (`Clients`).
4. Ajoutez un **appareil** avec IMEI pour ce client (`Appareils`).
5. Créez une **réparation** liée à cet appareil (`Réparations`), avec prix
   et durée de garantie.
6. Changez son statut vers **Terminé** → une **facture** est générée
   automatiquement (`Factures`).
7. Ajoutez des **pièces** en stock (`Stock`) — une alerte s'affiche si la
   quantité passe sous le seuil défini.

### 2. Annuaire public (marketplace, sans connexion requise)

1. Dans le dashboard, allez sur **`Profil de ma boutique`** :
   - remplissez ville, adresse, téléphone, WhatsApp, réseaux sociaux, horaires
   - cliquez sur **« Utiliser ma position actuelle »** (ou entrez latitude/longitude
     manuellement) pour la géolocalisation
   - cochez les **services** proposés (Réparation iPhone, Micro-soudure, etc.)
   - ajoutez vos **produits** en vente (chargeurs, écrans, batteries...)
   - dès que ville + téléphone + position GPS + nom sont renseignés, le profil
     passe automatiquement en **« publié »** et devient visible dans la recherche
2. Ouvrez `/recherche` (accessible sans compte, lien "Trouver un réparateur"
   depuis la page d'accueil) :
   - filtrez par service
   - cliquez **« 📍 Près de moi »** pour trier les résultats par distance
     (le navigateur demande la permission de géolocalisation)
   - les profils **Premium** puis **Pro** sont mis en avant avant les profils Free
3. Cliquez sur un résultat pour voir le **profil public** (`/boutique/[id]`) :
   services, produits, bouton Appeler / WhatsApp / Itinéraire Google Maps.

### Plans (à connecter à un vrai système de paiement plus tard)

Le champ `plan` sur `Boutique` (`free` / `pro` / `premium`) contrôle déjà le
tri dans la recherche et l'affichage du badge « ⭐ Premium » sur le profil
public. Pour l'instant il se règle manuellement en base (ex: via
`npx prisma studio`) — la prochaine étape sera de le relier à un paiement
d'abonnement réel (D17, carte bancaire...).

## Déploiement en ligne (Vercel + Postgres)

Le projet est déjà configuré pour Postgres (nécessaire en production, car
SQLite ne fonctionne pas sur un hébergement serverless comme Vercel).

1. **Créez une base Postgres gratuite** — le plus simple est
   [Neon](https://neon.tech) ou [Supabase](https://supabase.com) (Railway
   fonctionne aussi). Récupérez l'URL de connexion (`postgresql://...`).

2. **Mettez le code sur GitHub** :
   ```bash
   git init
   git add .
   git commit -m "Premier commit"
   ```
   Créez un dépôt sur github.com puis :
   ```bash
   git remote add origin https://github.com/VOTRE-COMPTE/maboutique-repair.git
   git push -u origin main
   ```

3. **Importez le projet sur [vercel.com](https://vercel.com)** :
   - "New Project" → sélectionnez votre dépôt GitHub
   - Dans "Environment Variables", ajoutez :
     - `DATABASE_URL` = l'URL Postgres récupérée à l'étape 1
     - `JWT_SECRET` = une chaîne aléatoire longue (ex: générée avec
       `openssl rand -base64 32`)
   - Cliquez "Deploy"

4. **Appliquez le schéma à la base de production** (une seule fois, depuis
   votre machine, avec `DATABASE_URL` pointant vers la base de production) :
   ```bash
   npx prisma migrate deploy
   ```

5. Vercel vous donne une URL du type `https://maboutique-repair.vercel.app`
   — le site est en ligne. Vous pourrez ensuite brancher un nom de domaine
   personnalisé (ex: `maboutique-repair.tn`) depuis les réglages du projet
   sur Vercel.

Chaque `git push` sur la branche principale redéploie automatiquement le
site.

## Prochaines étapes possibles

- Passer de SQLite à PostgreSQL pour la production (changer `provider` dans
  `prisma/schema.prisma` et `DATABASE_URL`).
- Upload réel de logo/photos (actuellement `logoUrl`/`photos` acceptent une
  URL ; brancher un service comme Cloudinary ou S3 pour l'upload direct).
- Ajouter les avis clients, la demande de devis en ligne et la réservation.
- Intégrer un moyen de paiement tunisien (D17, Clictopay, etc.) pour
  l'abonnement mensuel et la mise à niveau automatique du `plan`.
- Remplacer la saisie manuelle de latitude/longitude par un sélecteur sur
  une vraie carte (Google Maps ou Leaflet/OpenStreetMap).
- Déployer sur Vercel (frontend) + une base Postgres managée (Railway,
  Neon, Supabase...).

## Structure du projet

```
app/
  page.tsx              → page d'accueil publique
  register/page.tsx      → inscription boutique
  login/page.tsx          → connexion
  dashboard/
    layout.tsx            → vérifie la session, affiche la sidebar
    page.tsx               → tableau de bord (stats)
    clients/page.tsx
    appareils/page.tsx
    reparations/page.tsx
    stock/page.tsx
    factures/page.tsx
  api/
    register, login, logout
    clients, devices, repairs, repairs/[id], stock
prisma/schema.prisma       → modèle de données
lib/db.ts                  → client Prisma
lib/auth.ts                → session (JWT en cookie httpOnly)
middleware.ts               → protège /dashboard
```
