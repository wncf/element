## Button

Botones comúnmente usados.

### Uso básico

:::demo Use `type`, `plain`,`round` y `circle` para definir estilos a los botones.

```html
<hzq-row>
  <hzq-button>Default</hzq-button>
  <hzq-button type="primary">Primary</hzq-button>
  <hzq-button type="success">Success</hzq-button>
  <hzq-button type="info">Info</hzq-button>
  <hzq-button type="warning">Warning</hzq-button>
  <hzq-button type="danger">Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button plain>Plain</hzq-button>
  <hzq-button type="primary" plain>Primary</hzq-button>
  <hzq-button type="success" plain>Success</hzq-button>
  <hzq-button type="info" plain>Info</hzq-button>
  <hzq-button type="warning" plain>Warning</hzq-button>
  <hzq-button type="danger" plain>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button round>Round</hzq-button>
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

### Botón deshabilitado

El atributo `disabled` determina su un botón esta deshabilitado.

:::demo Use el atributo `disabled` para determinar si un botón esta deshabilitado. Acepta un valor `Boolean`.

```html
<hzq-row>
  <hzq-button disabled>Default</hzq-button>
  <hzq-button type="primary" disabled>Primary</hzq-button>
  <hzq-button type="success" disabled>Success</hzq-button>
  <hzq-button type="info" disabled>Info</hzq-button>
  <hzq-button type="warning" disabled>Warning</hzq-button>
  <hzq-button type="danger" disabled>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button plain disabled>Plain</hzq-button>
  <hzq-button type="primary" plain disabled>Primary</hzq-button>
  <hzq-button type="success" plain disabled>Success</hzq-button>
  <hzq-button type="info" plain disabled>Info</hzq-button>
  <hzq-button type="warning" plain disabled>Warning</hzq-button>
  <hzq-button type="danger" plain disabled>Danger</hzq-button>
</hzq-row>
```
:::

### Botón de texto

Botones sin borde ni fondo.

:::demo
```html
<hzq-button type="text">Text Button</hzq-button>
<hzq-button type="text" disabled>Text Button</hzq-button>
```
:::

### Botón icono

Use iconos para darle mayor significado a Button. Se puede usar simplemente un icono o un icono con texto.

:::demo Use el atributo `icon` para agregar un icono. Puede encontrar el listado de iconos en el componente de iconos. Agregar iconos a la derecha del texto se puede conseguir con un tag `<i>`. También se pueden usar iconos personalizados.

```html
<hzq-button type="primary" icon="hzq-icon-edit"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-share"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-delete"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-search">Search</hzq-button>
<hzq-button type="primary">Upload<i class="hzq-icon-upload hzq-icon-right"></i></hzq-button>
```
:::

### Grupo de botones

Mostrar un grupo de botones puede ser usado para mostrar un grupo de operaciones similares.

:::demo Use el tag `<hzq-button-group>` para agrupar sus botones.

```html
<hzq-button-group>
  <hzq-button type="primary" icon="hzq-icon-arrow-left">Previous Page</hzq-button>
  <hzq-button type="primary">Next Page<i class="hzq-icon-arrow-right hzq-icon-right"></i></hzq-button>
</hzq-button-group>
<hzq-button-group>
  <hzq-button type="primary" icon="hzq-icon-edit"></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-share"></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-delete"></hzq-button>
</hzq-button-group>
```
:::

### Botón de descarga 

Cuando se hace clic en un botón para descargar datos, el botón muestra un estado de descarga.

:::demo Ajuste el atributo `loading` a `true` para mostrar el estado de descarga.

```html
<hzq-button type="primary" :loading="true">Loading</hzq-button>
```
:::

### Tamaños

Además del tamaño por defecto, el componente Button provee cuatro tamaños para utilizar en diferentes escenarios.

:::demo Use el atributo `size` para setear tamaños adicionales con `large`, `medium`, `small` o `mini`. Sin `size` el botón es `medium`; las cuatro alturas son 36px, 32px, 28px y 24px.

```html
<hzq-row>
  <hzq-button>Default</hzq-button>
  <hzq-button size="large">Large</hzq-button>
  <hzq-button size="medium">Medium</hzq-button>
  <hzq-button size="small">Small</hzq-button>
  <hzq-button size="mini">Mini</hzq-button>
</hzq-row>
<hzq-row>
  <hzq-button round>Default</hzq-button>
  <hzq-button size="large" round>Large</hzq-button>
  <hzq-button size="medium" round>Medium</hzq-button>
  <hzq-button size="small" round>Small</hzq-button>
  <hzq-button size="mini" round>Mini</hzq-button>
</hzq-row>
```
:::

### Atributos
| Atributo    | Descripción                                   | Tipo    | Valores aceptados                                  | Por defecto |
| ----------- | --------------------------------------------- | ------- | -------------------------------------------------- | ----------- |
| size        | tamaño del botón                              | string  | large / medium / small / mini | —           |
| type        | tipo de botón                                 | string  | primary / success / warning / danger / info / text | —           |
| plain       | determinar si es o no un botón plano          | boolean | —                                                  | false       |
| round       | determinar si es o no un botón redondo        | boolean | —                                                  | false       |
| circle      | determina si es un botón circular             | boolean | —                                                  | false       |
| loading     | determinar si es o no un botón de descarga    | boolean | —                                                  | false       |
| disabled    | deshabilitar el botón                         | boolean | —                                                  | false       |
| icon        | nombre de la clase del icono                  | string  | —                                                  | —           |
| autofocus   | misma funcionalidad que la nativa `autofocus` | boolean | —                                                  | false       |
| native-type | misma funcionalidad que la nativa `type`      | string  | button / submit / reset                            | button      |

