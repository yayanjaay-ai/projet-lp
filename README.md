# AGINOVA SOLUTIONS SENEGAL - Site Vitrine

Site vitrine professionnel pour l'agence AGINOVA SOLUTIONS SENEGAL, spécialisée dans l'intelligence artificielle, le deep learning et le développement web.

## 🚀 Fonctionnalités

- **Design moderne et responsive** - Compatible avec tous les appareils
- **Interface utilisateur intuitive** - Navigation fluide et animations élégantes
- **Formulaire de contact intégré** - Avec validation côté client et serveur
- **Base de données SQLite** - Stockage sécurisé des messages de contact
- **API REST** - Backend Node.js avec Express
- **Sécurité renforcée** - Rate limiting, validation des données, protection CORS
- **Statistiques** - Suivi des contacts et analytics

## 🛠️ Technologies Utilisées

### Frontend
- HTML5 sémantique
- CSS3 avec variables personnalisées et animations
- JavaScript ES6+ (Vanilla)
- Font Awesome pour les icônes
- Google Fonts (Inter)

### Backend
- Node.js
- Express.js
- SQLite3
- Helmet (sécurité)
- CORS
- Rate limiting
- Validator.js

## 📦 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd gainde-ia-solutions
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```
Modifiez le fichier `.env` selon vos besoins.

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

5. **Ou démarrer en production**
```bash
npm start
```

Le site sera accessible sur `http://localhost:3000`

## 🗂️ Structure du Projet

```
gainde-ia-solutions/
├── database/
│   ├── db.js              # Module de gestion de la base de données
│   └── contacts.db        # Base de données SQLite (créée automatiquement)
├── routes/
│   └── contact.js         # Routes API pour les contacts
├── index.html             # Page principale
├── styles.css             # Styles CSS
├── script.js              # JavaScript frontend
├── server.js              # Serveur Express
├── package.json           # Dépendances et scripts
├── .env                   # Variables d'environnement
└── README.md              # Documentation
```

## 🔧 Configuration

### Variables d'environnement (.env)

```env
NODE_ENV=development
PORT=3000
DB_PATH=./database/contacts.db
JWT_SECRET=your_jwt_secret_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

### Scripts disponibles

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement avec nodemon
npm test           # Lancer les tests (à implémenter)
```

## 📡 API Endpoints

### Contacts

- `POST /api/contact` - Soumettre un nouveau contact
- `GET /api/contact` - Récupérer tous les contacts (admin)
- `GET /api/contact/:id` - Récupérer un contact spécifique
- `PUT /api/contact/:id/status` - Mettre à jour le statut d'un contact
- `DELETE /api/contact/:id` - Supprimer un contact

### Utilitaires

- `GET /api/health` - Vérifier l'état du serveur
- `GET /api/stats` - Obtenir les statistiques des contacts

### Exemple de requête POST /api/contact

```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "service": "consulting",
  "message": "Je souhaite obtenir plus d'informations sur vos services de consulting en IA."
}
```

### Réponse de succès

```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
  "contactId": 123
}
```

## 🔒 Sécurité

Le site implémente plusieurs mesures de sécurité :

- **Rate limiting** - Limitation du nombre de requêtes par IP
- **Validation des données** - Côté client et serveur
- **Protection CORS** - Configuration des origines autorisées
- **Helmet.js** - Headers de sécurité HTTP
- **Échappement des données** - Protection contre les injections XSS
- **Validation d'email** - Vérification du format des emails

## 📊 Base de Données

### Table `contacts`
- `id` - Identifiant unique (auto-increment)
- `name` - Nom du contact
- `email` - Adresse email
- `service` - Service demandé (consulting, ia, web, autre)
- `message` - Message du contact
- `created_at` - Date de création
- `status` - Statut (nouveau, en_cours, traité, fermé)
- `ip_address` - Adresse IP du contact
- `user_agent` - User agent du navigateur

### Table `contact_stats`
- `id` - Identifiant unique
- `date` - Date
- `total_contacts` - Nombre total de contacts
- `service_consulting` - Contacts pour consulting
- `service_ia` - Contacts pour IA
- `service_web` - Contacts pour développement web
- `service_autre` - Autres contacts

## 🎨 Personnalisation

### Couleurs (CSS Variables)
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    /* ... autres variables */
}
```

### Services
Pour ajouter ou modifier les services, modifiez :
1. Le HTML dans `index.html` (section services)
2. Les options du select dans le formulaire
3. La validation dans `routes/contact.js`

## 🚀 Déploiement

### Déploiement local
```bash
npm start
```

### Déploiement sur serveur
1. Configurer les variables d'environnement
2. Installer les dépendances : `npm install --production`
3. Démarrer avec PM2 : `pm2 start server.js --name gainde-ia`

### Déploiement sur Heroku
1. Créer une app Heroku
2. Configurer les variables d'environnement
3. Déployer : `git push heroku main`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

**AGINOVA SOMUTIONS SENEGAL**
- Email: contact.aginova-solutions-senegal@gmail.com
- Téléphone: +221 77402 76 56/+221 77 247 77 27
- Adresse: 538,Cité Boudiouck, Saint Louis, Sénégal

## 🔄 Changelog

### Version 1.0.0
- Site vitrine initial
- Formulaire de contact avec base de données
- API REST complète
- Design responsive
- Mesures de sécurité implémentées

---

Développé avec ❤️ par AGINOVA SOMUTIONS SENEGAL

