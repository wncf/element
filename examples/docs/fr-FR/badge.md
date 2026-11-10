## Badge

Un nombre ou un status affiché par-dessus un bouton ou un icône.

### Usage

Affiche le nombre de nouveaux messages.

:::demo La quantité est définit par `value` qui accepte un `Number` ou un `String`.

```html
<hzq-badge :value="12" class="item">
  <hzq-button size="small">Commentaires</hzq-button>
</hzq-badge>
<hzq-badge :value="3" class="item">
  <hzq-button size="small">Réponses</hzq-button>
</hzq-badge>
<hzq-badge :value="1" class="item" type="primary">
  <hzq-button size="small">Commentaires</hzq-button>
</hzq-badge>
<hzq-badge :value="2" class="item" type="warning">
  <hzq-button size="small">Réponses</hzq-button>
</hzq-badge>

<hzq-dropdown trigger="click">
  <span class="hzq-dropdown-link">
    Cliquez<i class="hzq-icon-caret-bottom hzq-icon--right"></i>
  </span>
  <hzq-dropdown-menu slot="dropdown">
    <hzq-dropdown-item class="clearfix">
      Commentaires
      <hzq-badge class="mark" :value="12" />
    </hzq-dropdown-item>
    <hzq-dropdown-item class="clearfix">
      Réponses
      <hzq-badge class="mark" :value="3" />
    </hzq-dropdown-item>
  </hzq-dropdown-menu>
</hzq-dropdown>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Valeur maximale

Vous pouvez configurer la valeur maximale.

:::demo La valeur maximale est définit par `max` qui accepte un `Number`. Ceci ne marche qui si `value` est également un `Number`.

```html
<hzq-badge :value="200" :max="99" class="item">
  <hzq-button size="small">Commentaires</hzq-button>
</hzq-badge>
<hzq-badge :value="100" :max="10" class="item">
  <hzq-button size="small">Réponses</hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Configuration

Affiche du texte autre que des nombres.

:::demo Quand `value` est un `String`, il affiche un texte personnalisé.

```html
<hzq-badge value="new" class="item">
  <hzq-button size="small">Commentaires</hzq-button>
</hzq-badge>
<hzq-badge value="hot" class="item">
  <hzq-button size="small">Réponses</hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Point rouge

Utilisez un point rouge pour signaler du contenu devant être remarqué.

:::demo Utilisez l'attribut `is-dot` qui est un `Boolean`.

```html
<hzq-badge is-dot class="item">Requète</hzq-badge>
<hzq-badge is-dot class="item">
  <hzq-button class="share-button" icon="hzq-icon-share" type="primary"></hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Attributs

| Attribut     | Description     | Type            | Valeurs acceptées       | Défaut |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| value         | Valeur affichée.   | string, number  |          —            |    —    |
| max           |  Valeur maximale, affiche '{max}+' quand elle est dépassée. Ne marche que si `value` est un `Number`.   | number  |         —              |     —    |
| is-dot        | Affiche un point rouge. | boolean   |    —           |  false  |
| hidden        | Cache le badge.    | boolean         |          —            |  false  |
| type          | Type du bouton.     | string          | primary / success / warning / danger / info |   —  |
