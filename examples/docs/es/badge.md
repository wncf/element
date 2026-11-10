## Badge

Marcas en forma de número o estado para botones e iconos.

### Uso básico

Muestra la cantidad de mensajes nuevos.

:::demo La cantidad está definida por `value` que acepta `Number` o `String`.

```html
<hzq-badge :value="12" class="item">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge :value="3" class="item">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>
<hzq-badge :value="1" class="item" type="primary">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge :value="2" class="item" type="warning">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>

<hzq-dropdown trigger="click">
  <span class="hzq-dropdown-link">
    Click Me<i class="hzq-icon-caret-bottom hzq-icon--right"></i>
  </span>
  <hzq-dropdown-menu slot="dropdown">
    <hzq-dropdown-item class="clearfix">
      comments
      <hzq-badge class="mark" :value="12" />
    </hzq-dropdown-item>
    <hzq-dropdown-item class="clearfix">
      replies
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

### Valor máximo

Se puede personalizar el valor máximo.

:::demo El valor máximo se define como `max` el cual es un `Number`. Nota: solo funciona si `value` es también un `Number`.

```html
<hzq-badge :value="200" :max="99" class="item">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge :value="100" :max="10" class="item">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Personalizaciones

Mostrar texto en vez de números.

:::demo Cuando `value` es un `String`, puede mostrar texto personalizado.

```html
<hzq-badge value="new" class="item">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge value="hot" class="item">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Pequeño punto rojo

Puede utilizar un punto rojo para marcar contenido que debe ser notado.

:::demo Use el atributo `is-dot`. Es un `Boolean`.

```html
<hzq-badge is-dot class="item">query</hzq-badge>
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

### Atributos
| Atributo | Descripción                              | Tipo           | Valores aceptados | Por defecto |
| -------- | ---------------------------------------- | -------------- | ----------------- | ----------- |
| value    | valor a mostrar                          | string, number | —                 | —           |
| max      | valor máximo, Muestra '{max}+' cuando se excede. Solo funciona si `value` es un `Number` | number         | —                 | —           |
| is-dot   | si se debe mostrar un pequeño punto      | boolean        | —                 | false       |
| hidden   | oculta el badge                    | boolean        | —                 | false       |
| type     | tipo de botón                            | string         | primary / success / warning / danger / info | — |

