## Steps

Guía al usuario para completar tareas de acuerdo con el proceso. Sus pasos pueden configurarse de acuerdo con el escenario de aplicación real y el número de pasos no puede ser inferior a dos.

### Uso básico

Barra de pasos simple.

:::demo Defina el atributo `active` con un valor de tipo `Number`, que indica el índice de pasos y comienza desde 0. Puede definir el atributo `space` cuando es necesario fijar el ancho del paso que acepta el tipo `Number`. La unidad del atributo `space` es px. Si no está configurado, es responsive. La configuración del atributo `finish-status` puede cambiar el estado de los pasos completados.

```html
<hzq-steps :active="active" finish-status="success">
  <hzq-step title="Step 1"></hzq-step>
  <hzq-step title="Step 2"></hzq-step>
  <hzq-step title="Step 3"></hzq-step>
</hzq-steps>

<hzq-button style="margin-top: 12px;" @click="next">Next step</hzq-button>

<script>
  export default {
    data() {
      return {
        active: 0
      };
    },

    methods: {
      next() {
        if (this.active++ > 2) this.active = 0;
      }
    }
  }
</script>
```
:::

### Step bar con el estatus

Muestra el estado del step para cada paso.

:::demo Utilice el atributo `title` para establecer el nombre del paso, o sobrescriba el atributo usando un slot con nombre. Hemos enumerado todos los nombres de slots al final de esta página.

```html
<hzq-steps :space="200" :active="1" finish-status="success">
  <hzq-step title="Done"></hzq-step>
  <hzq-step title="Processing"></hzq-step>
  <hzq-step title="Step 3"></hzq-step>
</hzq-steps>
```
:::

### Centrado

El título y la descripción pueden estar centrados.

:::demo
```html
<hzq-steps :active="2" align-center>
  <hzq-step title="Step 1" description="Some description"></hzq-step>
  <hzq-step title="Step 2" description="Some description"></hzq-step>
  <hzq-step title="Step 3" description="Some description"></hzq-step>
  <hzq-step title="Step 4" description="Some description"></hzq-step>
</hzq-steps>
```
:::

### Step bar con descripción

Puede poner una descripción para cada paso.

:::demo
```html
<hzq-steps :active="1">
  <hzq-step title="Step 1" description="Some description"></hzq-step>
  <hzq-step title="Step 2" description="Some description"></hzq-step>
  <hzq-step title="Step 3" description="Some description"></hzq-step>
</hzq-steps>
```
:::

### Step bar con icono

En la barra de pasos se pueden utilizar diversos iconos personalizados.

:::demo El icono se define mediante la propiedad `icon`. Los tipos de iconos se pueden encontrar en la descripción del componente Icono. Además, puede personalizar el icono a través de un slot con nombre.

```html
<hzq-steps :active="1">
  <hzq-step title="Step 1" icon="hzq-icon-edit"></hzq-step>
  <hzq-step title="Step 2" icon="hzq-icon-upload"></hzq-step>
  <hzq-step title="Step 3" icon="hzq-icon-picture"></hzq-step>
</hzq-steps>
```
:::

### Step bar vertical

Step bar vertical.

:::demo Sólo tiene que fijar el atributo `direction`  a ` vertical` en el elemento `hzq-steps`.

```html
<div style="height: 300px;">
  <hzq-steps direction="vertical" :active="1">
    <hzq-step title="Step 1"></hzq-step>
    <hzq-step title="Step 2"></hzq-step>
    <hzq-step title="Step 3"></hzq-step>
  </hzq-steps>
</div>
```
:::

### Step bar simple
Step bar simple, donde se ignorará `align-center`, `description`, `direction` y `space`.

:::demo
```html

<hzq-steps :space="200" :active="1" simple>
  <hzq-step title="Step 1" icon="hzq-icon-edit"></hzq-step>
  <hzq-step title="Step 2" icon="hzq-icon-upload"></hzq-step>
  <hzq-step title="Step 3" icon="hzq-icon-picture"></hzq-step>
</hzq-steps>

<hzq-steps :active="1" finish-status="success" simple style="margin-top: 20px">
  <hzq-step title="Step 1" ></hzq-step>
  <hzq-step title="Step 2" ></hzq-step>
  <hzq-step title="Step 3" ></hzq-step>
</hzq-steps>
```
:::

### Steps atributos

| Atributo       | Descripción                                                  | Tipo            | Valores aceptados                         | Por defecto |
| -------------- | ------------------------------------------------------------ | --------------- | ----------------------------------------- | ----------- |
| space          | el espaciado de cada paso, será responsivo si se omite. Soporta porcentaje. | number / string | —                                         | —           |
| direction      | dirección de visualización                                   | string          | vertical/horizontal                       | horizontal  |
| active         | actual paso de activación                                    | number          | —                                         | 0           |
| process-status | estatus del paso actual                                      | string          | wait / process / finish / error / success | process     |
| finish-status  | estatus del paso final                                       | string          | wait / process / finish / error / success | finish      |
| align-center   | centrado de título y descripción                             | boolean         | —                                         | false       |
| simple         | si aplicar un tema simple                                    | boolean         | -                                         | false       |

### Step atributos
| Atributo    | Descripción                              | Tipo                                     | Valores aceptados | Por defecto |
| ----------- | ---------------------------------------- | ---------------------------------------- | ----------------- | ----------- |
| title       | titulo del paso                          | string                                   | —                 | —           |
| description | descripción del paso                     | string                                   | —                 | —           |
| icon        | icono del paso                           | nombre de la clase del icono del paso. Los iconos también se pueden pasar a través del slot con nombre | string            | —           |
| status      | estado actual. Se configurará automáticamente mediante Steps si no está configurado. | wait / process / finish / error / success | -                 |             |

### Slot Step
| Nombre      | Descripción          |
| ----------- | -------------------- |
| icon        | Icono personalizado  |
| title       | Titulo del paso      |
| description | Descripción del paso |

