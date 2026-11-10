## Bouton

Bouton communément utilisé.

### Usage

:::demo Utilisez `type`, `plain`, `round` et `circle` pour définir le style du bouton.

```html
<hzq-row>
  <hzq-button>Défaut</hzq-button>
  <hzq-button type="primary">Primary</hzq-button>
  <hzq-button type="success">Success</hzq-button>
  <hzq-button type="info">Info</hzq-button>
  <hzq-button type="warning">Warning</hzq-button>
  <hzq-button type="danger">Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button plain>Plein</hzq-button>
  <hzq-button type="primary" plain>Primary</hzq-button>
  <hzq-button type="success" plain>Success</hzq-button>
  <hzq-button type="info" plain>Info</hzq-button>
  <hzq-button type="warning" plain>Warning</hzq-button>
  <hzq-button type="danger" plain>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button round>Arrondi</hzq-button>
  <hzq-button type="primary" round>Primary</hzq-button>
  <hzq-button type="success" round>Success</hzq-button>
  <hzq-button type="info" round>Info</hzq-button>
  <hzq-button type="warning" round>Warning</hzq-button>
  <hzq-button type="danger" round>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button icon="hzq-icon-search" circle></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-edit" circle></hzq-button>
  <hzq-button type="success" icon="hzq-icon-check" circle></hzq-button>
  <hzq-button type="info" icon="hzq-icon-message" circle></hzq-button>
  <hzq-button type="warning" icon="hzq-icon-star-off" circle></hzq-button>
  <hzq-button type="danger" icon="hzq-icon-delete" circle></hzq-button>
</hzq-row>
```
:::

### Bouton désactivé

L'attribut `disabled` détermine si le bouton est désactivé.

:::demo Utilisez l'attribut `disabled` pour déterminer si un bouton est désactivé ou non. Il accepte un `Boolean`.

```html
<hzq-row>
  <hzq-button disabled>Défaut</hzq-button>
  <hzq-button type="primary" disabled>Principal</hzq-button>
  <hzq-button type="success" disabled>Succès</hzq-button>
  <hzq-button type="info" disabled>Info</hzq-button>
  <hzq-button type="warning" disabled>Attention</hzq-button>
  <hzq-button type="danger" disabled>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button plain disabled>Plein</hzq-button>
  <hzq-button type="primary" plain disabled>Principal</hzq-button>
  <hzq-button type="success" plain disabled>Succès</hzq-button>
  <hzq-button type="info" plain disabled>Info</hzq-button>
  <hzq-button type="warning" plain disabled>Attention</hzq-button>
  <hzq-button type="danger" plain disabled>Danger</hzq-button>
</hzq-row>
```
:::

### Bouton texte

Bouton sans bordure ni fond.

:::demo
```html
<hzq-button type="text">Bouton texte</hzq-button>
<hzq-button type="text" disabled>Bouton texte</hzq-button>
```
:::

### Icône

Utilisez des icônes pour ajouter plus de sens aux boutons. Vous pouvez utiliser uniquement l'icône pour économiser de l'espace, ou bien l'utiliser avec du texte.

:::demo Utilisez l'attribut `icon` pour ajouter une icône. Vous pourrez trouver la liste des icônes dans le composant Icon d'Element. Ajouter des icônes sur le coté droit du texte est possible grâce à la balise `<i>`. Des icônes personnalisées peuvent également être utilisées.

```html
<hzq-button type="primary" icon="hzq-icon-edit"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-share"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-delete"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-search">Recherche</hzq-button>
<hzq-button type="primary">Upload<i class="hzq-icon-upload hzq-icon-right"></i></hzq-button>
```
:::

### Groupes de boutons

Affiche un groupe de bouton. Peut être utilisé pour grouper un ensemble d'opérations similaires.

:::demo Utilisez la balise `<hzq-button-group>` pour grouper vos boutons.

```html
<hzq-button-group>
  <hzq-button type="primary" icon="hzq-icon-arrow-left">Page précédente</hzq-button>
  <hzq-button type="primary">Page suivante<i class="hzq-icon-arrow-right hzq-icon-right"></i></hzq-button>
</hzq-button-group>
<hzq-button-group>
  <hzq-button type="primary" icon="hzq-icon-edit"></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-share"></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-delete"></hzq-button>
</hzq-button-group>
```
:::

### Bouton en chargement

Cliquez sur le bouton pour charger des données et il affichera un état de chargement.

:::demo Configurez l'attribut `loading` à `true` pour afficher un état de chargement.

```html
<hzq-button type="primary" :loading="true">Chargement</hzq-button>
```
:::

### Tailles

En plus de la taille par défaut, le composant Button fournit quatre tailles pour différents scénarios.

:::demo Utilisez l'attribut `size` pour choisir d'autres tailles parmi `large`, `medium`, `small` ou `mini`. Sans `size` le bouton est `medium` ; les quatre hauteurs sont 36px, 32px, 28px et 24px.

```html
<hzq-row>
  <hzq-button>Défaut</hzq-button>
  <hzq-button size="large">Large</hzq-button>
  <hzq-button size="medium">Medium</hzq-button>
  <hzq-button size="small">Small</hzq-button>
  <hzq-button size="mini">Mini</hzq-button>
</hzq-row>
<hzq-row>
  <hzq-button round>Défaut</hzq-button>
  <hzq-button size="large" round>Large</hzq-button>
  <hzq-button size="medium" round>Medium</hzq-button>
  <hzq-button size="small" round>Small</hzq-button>
  <hzq-button size="mini" round>Mini</hzq-button>
</hzq-row>
```
:::

### Attributs
| Attribut      | Description    | Type      | Valeurs acceptées       | Défaut   |
|---------- |-------- |---------- |-------------  |-------- |
| size     | Taille du bouton.   | string  | large / medium / small / mini |    —     |
| type     | Type du bouton.   | string    |   primary / success / warning / danger / info / text |     —    |
| plain     | Détermine si le bouton est plein.   | boolean    | — | false   |
| round     | Détermine si le bouton est arrondi.   | boolean    | — | false   |
| circle     | Détermine si le bouton est un cercle.   | boolean    | — | false   |
| loading   | Détermine si l'état de chargement est affiché.   | boolean    | — | false   |
| disabled  | Désactive le bouton    | boolean   | —   | false   |
| icon  | Classe de l'icône. | string   |  —  |  —  |
| autofocus  | Identique à l'attribut natif `autofocus` | boolean   |  —  |  false  |
| native-type | Identique à l'attribut natif `type` | string | button / submit / reset | button |
