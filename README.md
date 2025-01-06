
# Explication du Code

## Authentification et Autorisation

### Fonctionnalités

#### Inscription (`/auth/signup`)
- Enregistrement d'un utilisateur avec validation des données (email, mot de passe, prénom, nom, rôles).
- Hachage sécurisé des mots de passe avec **Argon2**.
- Création automatique d'un panier (cart) pour les utilisateurs avec le rôle `CLIENT`.
- Retourne un jeton JWT pour l'utilisateur enregistré.

#### Connexion (`/auth/login`)
- Authentification d'un utilisateur avec ses identifiants (email et mot de passe).
- Vérification du mot de passe haché.
- Retourne un jeton JWT pour un accès sécurisé aux routes protégées.

#### Protection des routes
- Utilisation de **JWT** pour protéger les endpoints sensibles.
- Vérification des rôles avec un décorateur personnalisé `@AuthRoles`.

#### Gestion des rôles
- Différents rôles utilisateur (exemple : `ADMIN`, `CLIENT`, `SELLER`) pour restreindre l'accès aux fonctionnalités spécifiques.

### Structure des fichiers

#### 1. `AuthController`
Ce contrôleur gère les endpoints suivants :
- **POST `/auth/signup`** : Inscrit un nouvel utilisateur.
- **POST `/auth/login`** : Connecte un utilisateur existant.

#### 2. `AuthService`
Service contenant la logique métier pour :
- Inscrire les utilisateurs en hachant leurs mots de passe.
- Authentifier les utilisateurs et générer des tokens JWT.
- Valider les rôles des utilisateurs.

#### 3. DTOs (Data Transfer Objects)
- **`SignupDTO`** : Valide les données d'inscription (email, mot de passe, prénom, etc.).
- **`LoginDTO`** : Valide les données de connexion (email, mot de passe).

#### 4. JWT Strategy
Stratégie pour valider les tokens JWT :
- Extrait le token JWT des en-têtes HTTP (`Authorization`).
- Vérifie la validité du token et extrait les informations de l'utilisateur (ID, email).
- Ajoute les données de l'utilisateur à la requête.

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


## Les fonctionnalités de l'application

- Un administrateur crée un produit en définissant son stock disponible.
- Un vendeur (ou l'administration) valide les commandes passées par des clients.
- Le client peut noter un produit et laisser un commenataire.

## Configuration de l'environnement de développement

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
