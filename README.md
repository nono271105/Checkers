<h1 align="center">
  React Checkers
</h1>

[![React 18+](https://img.shields.io/badge/react-18+-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/build-vite-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/styling-tailwind-38b2ac.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Une application React complète pour jouer aux dames (checkers) avec une **IA multi-niveaux** et une interface moderne. Implémentation du jeu classique avec algorithmes d'intelligence artificielle avancés et historique de mouvements.

### 🚀 Démo en ligne

Jouez dès maintenant sans installation : **[https://dames-nolhan.vercel.app/](https://dames-nolhan.vercel.app/)**

## Fonctionnalités

### 🎮 Gameplay
- **Plateau 8×8** conforme aux règles des dames internationales
- **Pions et dames** : Pions rouges vs noirs avec promotion automatique
- **Mouvements et captures** : 
  - Mouvements diagonaux pour pions et dames
  - Captures obligatoires avec prise en compte des captures multiples
  - Validation complète des coups légaux
- **Promotion** : Les pions qui atteignent la dernière ligne deviennent des dames
- **Historique des mouvements** : Suivi complet de la partie avec annulation

### 🤖 Intelligence Artificielle
- **4 niveaux de difficulté** :
  - **Easy** : Mouvements aléatoires
  - **Medium** : Évaluation heuristique simple
  - **Hard** : Algorithme Minimax avec profondeur limitée
  - **Expert** : Minimax avec élagage Alpha-Bêta (optimisation)
- **Évaluation intelligente** : Calcul du meilleur coup selon la position du plateau
- **Temps de réaction** : Délai variable selon la difficulté

### 🎨 Interface Utilisateur
- **Interface React moderne** avec composants réutilisables
- **Design Tailwind CSS** : Styling professionnel et responsif
- **Affichage temps réel** du plateau et des coups valides
- **Contrôles intuitifs** : Sélection drag-and-drop des pions
- **Sélecteur de mode** : Choix du niveau de difficulté avant chaque partie

## Installation

### Prérequis
- **Node.js 16+** (avec npm ou yarn)
- **Git** pour cloner le dépôt

### Étapes d'installation

1. **Clonez le dépôt** :
```bash
git clone https://github.com/yourusername/react-checkers.git
cd react-checkers
```

2. **Installez les dépendances** :

```bash
npm install
```

Ou avec yarn :
```bash
yarn install
```

3. **Vérifiez l'installation** :

```bash
npm -v && node -v
```

## Utilisation

### Lancement en développement

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur `http://localhost:5173` (Vite).

### Build pour production

```bash
npm run build
```

### 🎯 Comment jouer

1. **Sélectionnez votre niveau de difficulté** au démarrage
2. **Cliquez sur un pion** pour le sélectionner
3. **Cliquez sur une case** pour effectuer le mouvement
4. **Les captures obligatoires** sont automatiquement gérées
5. **Utilisez "Annuler"** pour revenir au coup précédent
6. **Nouvelle partie** pour recommencer

### 📋 Règles principales

- Les **pions** se déplacent uniquement en diagonale vers l'avant
- Les **dames** (pions promus) se déplacent en diagonale dans tous les sens
- Les **captures** sont obligatoires si disponibles
- **Captures multiples** : Un pion peut capturer plusieurs pions en un seul coup
- **Promotion** : Pion qui atteint la dernière ligne devient dame
- **Victoire** : Capturer tous les pions adverses ou bloquer tous les mouvements

## Structure du Projet

```
react-checkers/
├── index.html                     # Point d'entrée HTML
├── package.json                   # Dépendances et scripts
├── vite.config.js                 # Configuration Vite
├── tailwind.config.cjs            # Configuration Tailwind CSS
├── postcss.config.cjs             # Configuration PostCSS
├── src/
│   ├── main.jsx                   # Point d'entrée React
│   ├── App.jsx                    # Composant racine
│   ├── index.css                  # Styles globaux
│   ├── components/
│   │   ├── Board.jsx              # Affichage du plateau
│   │   └── Controls.jsx           # Contrôles et interface
│   ├── game/
│   │   └── logic.js               # Règles et logique du jeu
│   └── ai/
│       └── ai.js                  # Moteur IA (Easy/Medium/Hard/Expert)
└── README.md                      # Documentation
```

### Fichiers clés

- **[src/game/logic.js](src/game/logic.js)** : Cœur du moteur de jeu
  - Validation des mouvements
  - Gestion des captures
  - Détection de promotion
  - Calcul des coups légaux

- **[src/ai/ai.js](src/ai/ai.js)** : Moteur d'intelligence artificielle
  - Random selection (Easy)
  - Heuristic evaluation (Medium)
  - Minimax algorithm (Hard)
  - Minimax avec Alpha-Beta pruning (Expert)

- **[src/components/Board.jsx](src/components/Board.jsx)** : Rendu du plateau
  - Affichage des cases et pions
  - Gestion des interactions utilisateur
  - Visualisation des coups valides

## Dépendances

| Package | Version | Usage |
|---------|---------|-------|
| `react` | ^18.0.0 | Framework UI |
| `vite` | ^5.0.0 | Bundler et dev server |
| `tailwindcss` | ^3.0.0 | Framework CSS |
| `postcss` | ^8.0.0 | Traitement CSS |

---

## Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---

**Dernière mise à jour** : 14 Décembre 2025
