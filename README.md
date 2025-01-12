# Explication du Code

## Configuration de l'environnement de développement

### Les fichiers `.env`

Créer les fichiers `.env` de frontend et backend à partir des fichiers `.env.example`

### Générer la base de données

Exécutez cette commande dans le dossier backend :

```bash
npx prisma migrate dev
```

ou

```bash
npx prisma migrate dev --name init
```

### Lancer le serveur backend

Exécutez cette commande dans le dossier backend :

```bash
npm run start:dev
```

### Lancer le serveur frontend

Exécutez cette commande dans le dossier frontend :

```bash
npm run dev
```

## Authentification et Autorisation

### Fonctionnalités

#### Inscription (`/auth/signup`)

-  Enregistrement d'un utilisateur avec validation des données (email, mot de passe, prénom, nom, rôles).

-  Hachage sécurisé des mots de passe avec **Argon2**.

-  Création automatique d'un panier (cart) pour les utilisateurs avec le rôle `CLIENT`.

-  Retourne un jeton JWT pour l'utilisateur enregistré.

#### Connexion (`/auth/login`)

-  Authentification d'un utilisateur avec ses identifiants (email et mot de passe).

-  Vérification du mot de passe haché.

-  Retourne un jeton JWT pour un accès sécurisé aux routes protégées.

#### Protection des routes

-  Utilisation de **JWT** pour protéger les endpoints sensibles.

-  Vérification des rôles avec un décorateur personnalisé `@AuthRoles`.

#### Gestion des rôles

-  Différents rôles utilisateur (exemple : `ADMIN`, `CLIENT`, `SELLER`) pour restreindre l'accès aux fonctionnalités spécifiques.

### Structure des fichiers

#### 1. `AuthController`

Ce contrôleur gère les endpoints suivants :

-  **POST `/auth/signup`** : Inscrit un nouvel utilisateur.

-  **POST `/auth/login`** : Connecte un utilisateur existant.

#### 2. `AuthService`

Service contenant la logique métier pour :

-  Inscrire les utilisateurs en hachant leurs mots de passe.

-  Authentifier les utilisateurs et générer des tokens JWT.

-  Valider les rôles des utilisateurs.

#### 3. DTOs (Data Transfer Objects)

-  **`SignupDTO`** : Valide les données d'inscription (email, mot de passe, prénom, etc.).

-  **`LoginDTO`** : Valide les données de connexion (email, mot de passe).

#### 4. JWT Strategy

Stratégie pour valider les tokens JWT :

-  Extrait le token JWT des en-têtes HTTP (`Authorization`).

-  Vérifie la validité du token et extrait les informations de l'utilisateur (ID, email).

-  Ajoute les données de l'utilisateur à la requête.

#### 5. Décorateur `@AuthRoles`

Permet de restreindre l'accès à certaines routes selon les rôles. Exemple :

```typescript
@AuthRoles(Role.ADMIN, Role.SELLER)
@Get('dashboard')
getDashboard() {
  return this.dashboardService.getData();
}
```

#### 6. Décorateur `@GetUser`

Permet d'accéder facilement aux informations de l'utilisateur connecté :

```typescript
@GetUser() user: User
@GetUser('email') email: string
```

---

## Diagramme de classes

![Screenshot 9 - Digramme de classe](screenshots/diagram.jpg)

## Les fonctionnalités de l'application

-  Un vendeur peut valider ou refuser les commandes passées par des clients.

-  Un administrateur et un vendeur qui peut ajouter et modifier des produits et leur stock disponible.

-  Le client peut :

   -  Modifier son profil (adresse, mot de passe, nom, etc).

   -  Ajouter des produits avec leur quantité au panier.

   -  Modifier le contenu de son panier.

   -  Passer une commande à partir de son panier avec son adresse principale ou une adresse spécifique.

   -  Annuler une commande avant qu'elle soit traitée par le vendeur (ou l'administrateur).

   -  Le client peut récupérer la facture de sa commande à partir de `/orders` en cliquant sur la commande en question pour voir ses détails et l'imprimer.

   -  Noter un produit et laisser un commentaire.

---

## Captures d'écran des fonctionnalités

### **1. Interface d'inscription**

Voici l'interface d'inscription où les utilisateurs peuvent créer un compte en fournissant leurs informations :

![Screenshot 1 - Interface d'inscription](screenshots/signup.png)

---

### **2. Interface de connexion**

L'interface de connexion permet aux utilisateurs existants de se connecter avec leur email et leur mot de passe :

![Screenshot 2 - Interface de connexion](screenshots/login.png)

---

### **3. Dashboard pour les vendeurs/Les admins**

Le tableau de bord des vendeurs affiche les commandes en attente, les produits en stock:

![Screenshot 3 - Dashboard pour les vendeurs/admins](screenshots/adminOrders.png)

![Screenshot 3bis - Dashboard pour les vendeurs/admins](screenshots/adminProducts.png)

---

### **4. Gestion du panier pour les clients**

Les clients peuvent ajouter, modifier ou supprimer des produits dans leur panier via une interface intuitive :

![Screenshot 4 - Gestion du panier](screenshots/clientshop.png)

![Screenshot 4bis - Gestion du panier](screenshots/reserverCommande.png)

---

### **5. Notation et review d'un produit**

Le client peut noter un produit et laisser un commentaire:

![Screenshot 5 - Product review](screenshots/productreview.png)


### **6. Détails des commandes**

Les clients peuvent consulter les détails de leurs commandes et imprimer une facture :

![Screenshot 6 - Détails des commandes](screenshots/myordersClient.png)

En cliquant sur la commande:

![Screenshot 6bis - Print invoice](screenshots/clique.png)

![Screenshot 6bis_ - Print invoice](screenshots/print.png)

![Screenshot 6bis__ - Print invoice](screenshots/invoice.png)

---

### **7. Modification des coordonnées personnelles

Les utilisateurs peuvent modifier leurs informations:


![Screenshot 7 - Modifier informations admin/seller](screenshots/modifierS.png)

![Screenshot 7bis - Modifier informations admin/seller](screenshots/modifierSS.png)

![Screenshot 8 - Modifier informations client](screenshots/modifierC.png)


### **8. Authorized Page

Cette page a pour but de démontrer que l'admin/seller n'a pas le droit de consulter un panier, d'où l'affichage de ce message:

![Screenshot 9 - Unauthorized Page](screenshots/adminUn.png)

![Screenshot 9 - Modifier informations client](screenshots/adminUnBis.png)