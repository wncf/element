## Breadcrumb

Affiche le chemin de la page actuelle, afin de pouvoir naviguer plus facilement.

### Usage


:::demo Dans `hzq-breadcrumb`, chaque `hzq-breadcrumb-item` est un tag représentant chaque niveau depuis la page d'accueil. Ce Composant possède un attribut de type `String` appelé `separator` qui détermine le séparateur. Sa valeur par défaut est '/'.

```html
<hzq-breadcrumb separator="/">
  <hzq-breadcrumb-item :to="{ path: '/' }">Accueil</hzq-breadcrumb-item>
  <hzq-breadcrumb-item><a href="/">Gestion promotions</a></hzq-breadcrumb-item>
  <hzq-breadcrumb-item>Liste promotions</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>Détail promotion</hzq-breadcrumb-item>
</hzq-breadcrumb>
```
:::

### Icône de séparation

:::demo Configurez `separator-class` pour utiliser `iconfont` en tant que séparateur. Cela remplacera `separator`.

```html
<hzq-breadcrumb separator-class="hzq-icon-arrow-right">
  <hzq-breadcrumb-item :to="{ path: '/' }">Accueil</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>Gestion promotions</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>Liste promotions</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>Détail promotion</hzq-breadcrumb-item>
</hzq-breadcrumb>
```
:::

### Attributs de Breadcrumb
| Attributs      | Description          | Type      | Valeurs acceptées            | Défaut|
|---------- |-------------- |---------- |--------------------------------  |-------- |
| separator | Caractère de séparation | string | — | / |
| separator-class | Classe de l'icône de séparation | string | — | - |

### Attributs de Breadcrumb Item
| Attributs      | Description          | Type      | Valeurs acceptées            | Défaut|
|---------- |-------------- |---------- |--------------------------------  |-------- |
| to | Route cible du lien, identique au `to` de `vue-router`. | string/object | — | — |
| replace | Si `true`, la navigation ne laissera pas d'historique. | boolean | — | false |
