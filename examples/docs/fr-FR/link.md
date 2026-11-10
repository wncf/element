## Link

Un hyperlien textuel.

### Usage basique

Lien texte basique.

:::demo

```html
<div>
  <hzq-link href="https://element.eleme.io" target="_blank">défaut</hzq-link>
  <hzq-link type="primary">primaire</hzq-link>
  <hzq-link type="success">succès</hzq-link>
  <hzq-link type="warning">avertissement</hzq-link>
  <hzq-link type="danger">danger</hzq-link>
  <hzq-link type="info">info</hzq-link>
</div>
```

:::

### Désactivé

Lien désactivé.

:::demo

```html
<div>
  <hzq-link disabled>défaut</hzq-link>
  <hzq-link type="primary" disabled>primaire</hzq-link>
  <hzq-link type="success" disabled>succès</hzq-link>
  <hzq-link type="warning" disabled>avertissement</hzq-link>
  <hzq-link type="danger" disabled>danger</hzq-link>
  <hzq-link type="info" disabled>info</hzq-link>
</div>
```

:::

### Souligné

Lien souligné.

:::demo

```html
<div>
  <hzq-link :underline="false">non souligné</hzq-link>
  <hzq-link>Souligné</hzq-link>
</div>
```

:::

### Icône

Lien avec icône.

:::demo

```html
<div>
  <hzq-link icon="hzq-icon-edit">Éditer</hzq-link>
  <hzq-link>Vérifier<i class="hzq-icon-view hzq-icon--right"></i> </hzq-link>
</div>
```

:::

### Attributs

| Attribut  | Description                     | Type    | Options                                     | Défaut  |
| --------- | ------------------------------- | ------- | ------------------------------------------- | ------- |
| type      | Type du lien.                   | string  | primary / success / warning / danger / info | défaut  |
| underline | Si le composant est souligné.   | boolean | —                                           | true    |
| disabled  | Si le composant est désactivé.  | boolean | —                                           | false   |
| href      | Identique au `href` natif.      | string  | —                                           | -       |
| icon      | Nom de classe de l'icône.       | string  | —                                           | -       |
