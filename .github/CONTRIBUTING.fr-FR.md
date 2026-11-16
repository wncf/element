# Guide à destination des contributeurs d'Element UI

Bonjour! Merci d'avoir choisi Element UI.

Element UI est une bibliothèque de composants basée sur Vue 2.0 pour les développeurs, les designers et les chefs de produits.

Nous sommes ravis que vous souhaitiez contribuer à Element. Avant de soumettre votre contribution, veuillez vous assurer de prendre un moment pour lire les indications suivantes.

## Concernant les issues

- Les issues concernent exclusivement les bugs, les demandes de fonctionnalités et les sujets liés à la conception. Les questions concernant d'autres sujets peuvent être fermées directement. Si vous avez des questions à propos de l'utilisation d'Element, veuillez vous rendre sur [Gitter](https://gitter.im/element-en/Lobby) pour obtenir de l'aide.

- Avant de soumettre une issue, veuillez vérifier si des problèmes similaires n'ont pas déjà été signalés.

- Veuillez spécifier la version de `Element` et `Vue` que vous utilisez, et fournir des informations sur le système d'exploitation et le navigateur. [JSFiddle](https://jsfiddle.net/) est recommandé afin de construire une démo pour que votre problème puisse être reproduit clairement.

## Concernant les pull requests

- Faites un fork de ce dépôt vers votre compte. Ne créez pas de branches ici.

- Les informations de validation doivent être formatées en tant que `[Nom du composant] : Info à propos de ce commit` (par exemple `Button : Fix xxx bug`)

- **NE PAS** inclure de fichiers dans le répertoire `lib`.

- Assurez-vous que l'exécution de `npm run dist` génère les bons fichiers.

- Pour des raisons de compatibilité et de taille de fichier, notre configuration babel n'importait que `preset-2015`, donc les API comme `Array.prototype.find` et `Object.assign` dans `ES2015` ne sont pas recommandées. Vous pouvez importer des polyfills si nécessaire.

- Faites un rebase avant la création d'une PR pour garder l'historique clair.

- Assurez-vous que les PRs sont créés dans la branche `dev` au lieu de la branche `master`.

- Si votre PR corrige un bug, veuillez fournir une description du bug en question.

- La fusion d'un PR nécessite deux responsables: l'un approuve les modifications après révision, puis l'autre les révise et les fusionne.

## Pré-requis

### Environnement

| Dépendance | Version | Remarque |
| --- | --- | --- |
| Node.js | 12.x (12.22.12 recommandé) | Un fichier `.nvmrc` est fourni ; lancez `nvm use` pour basculer |
| yarn | 1.x | **Obligatoire.** Les versions sont verrouillées par `yarn.lock` ; n'utilisez pas `npm install` |
| npm | 6+ | Sert uniquement à exécuter les scripts `npm run xxx` |

Node 14 fonctionne également, mais `.nvmrc` fait référence. Les styles sont compilés avec dart-sass : **Python, node-gyp et Visual Studio Build Tools ne sont pas nécessaires**.

### Premier démarrage

```shell
git clone https://github.com/wncf/element.git
cd element

# basculez sur la version de Node indiquée dans .nvmrc (si vous utilisez nvm)
nvm use

# 1. installez les dépendances
yarn install

# 2. démarrez le serveur de développement
npm run dev

# ouvrez http://localhost:8085
```

`npm run dev` exécute successivement `yarn install`, `build:file` et `webpack-dev-server`.

> **Note** : `examples/pages/` est généré par `build:file` à partir de `examples/pages/template/` et n'est pas versionné. Démarrer webpack sans lancer `build:file` échoue avec `Can't resolve './pages/zh-CN'`.

### Deux modes de développement

Les deux écoutent le port `8085` et **ne peuvent pas tourner en même temps**.

```shell
# Site de documentation : avec routeur, documentation et démos complètes
npm run dev

# Playground de composants : page unique, rechargement plus rapide
npm run dev:play
```

Les deux sont servis sur [http://localhost:8085](http://localhost:8085). `dev:play` n'a pas de routeur et affiche le playground ; `dev` est le site de documentation, par exemple `http://localhost:8085/#/fr-FR/component/button`.

Modifiez `examples/play/index.vue` pour choisir les composants affichés dans le playground.

### Build

```shell
npm run dist
```

### Tests

```shell
npm run test
```

Lance d'abord le lint et compile le thème, puis exécute les tests unitaires avec Karma + Headless Chrome. Chrome doit être installé, ou pointez `CHROME_BIN` vers un exécutable de navigateur.

Le cas `loading implies disabled` dans `button.spec.js` échoue dans certains environnements ; cela n'a aucun rapport avec le code métier.

## Concernant le développement de composants
- Exécutez `make new <nom-du-composant>` pour créer un répertoire pour le nouveau composant. Les tests, le fichier d'entrée et la documentation sont inclus.
- Reportez-vous au `Button` pour les composants imbriqués.
- Reportez-vous à `Select` pour connaître les composants qui dépendent d'autres composants.

## Style du code
Il suffit de se conformer à la configuration [ESLint](https://github.com/ElemeFE/eslint-config-elemefe) de [ElemeFE](https://github.com/elemefe).
