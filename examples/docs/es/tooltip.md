## Tooltip

Mostrar aviso de información con el hover del mouse.

### Uso básico

Tooltip tiene 9 colocaciones.

:::demo Use el atributo `content` para establecer el contenido que se mostrará al hacer hover. El atributo `placement` determina la posición del tooltip. Su valor es `[orientation]-[alignment]` con cuatro orientaciones `top`, `left`, `right`, `bottom` y tres alineaciones `start`, `end`, `null`, la alineación por defecto es null. Tome `placement="left-end"` como ejemplo, Tooltip será mostrado en la izquierda del elemento en que se esté haciendo hover y el fondo del tooltip se alineará con el fondo del elemento.
```html
<div class="box">
  <div class="top">
    <hzq-tooltip class="item" effect="dark" content="Top Left prompts info" placement="top-start">
      <hzq-button>top-start</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Top Center prompts info" placement="top">
      <hzq-button>top</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Top Right prompts info" placement="top-end">
      <hzq-button>top-end</hzq-button>
    </hzq-tooltip>
  </div>
  <div class="left">
    <hzq-tooltip class="item" effect="dark" content="Left Top prompts info" placement="left-start">
      <hzq-button>left-start</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Left Center prompts info" placement="left">
      <hzq-button>left</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Left Bottom prompts info" placement="left-end">
      <hzq-button>left-end</hzq-button>
    </hzq-tooltip>
  </div>

  <div class="right">
    <hzq-tooltip class="item" effect="dark" content="Right Top prompts info" placement="right-start">
      <hzq-button>right-start</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Right Center prompts info" placement="right">
      <hzq-button>right</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Right Bottom prompts info" placement="right-end">
      <hzq-button>right-end</hzq-button>
    </hzq-tooltip>
  </div>
  <div class="bottom">
    <hzq-tooltip class="item" effect="dark" content="Bottom Left prompts info" placement="bottom-start">
      <hzq-button>bottom-start</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Bottom Center prompts info" placement="bottom">
      <hzq-button>bottom</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Bottom Right prompts info" placement="bottom-end">
      <hzq-button>bottom-end</hzq-button>
    </hzq-tooltip>
  </div>
</div>

<style>
  .box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 110px;
    }

    .right {
      float: right;
      width: 110px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .hzq-tooltip__popper,
    .right .hzq-tooltip__popper {
      padding: 8px 10px;
    }

    .hzq-button {
      width: 110px;
    }
  }
</style>
```
:::


### Tema

Tooltip tiene dos temas: `dark` y `light`.

:::demo Establecer `effect` para modificar el tema, el valor por defecto es `dark`.
```html
<hzq-tooltip content="Top center" placement="top">
  <hzq-button>Dark</hzq-button>
</hzq-tooltip>
<hzq-tooltip content="Bottom center" placement="bottom" effect="light">
  <hzq-button>Light</hzq-button>
</hzq-tooltip>
```
:::

### Más Contenido

Despliegue múltiples líneas de texto y establezca su formato.

:::demo Sobrescriba el atributo `content` del `hzq-tooltip` añadiendo un slot llamado `content`.
```html
<hzq-tooltip placement="top">
  <div slot="content">multiple lines<br/>second line</div>
  <hzq-button>Top center</hzq-button>
</hzq-tooltip>
```
:::

### Uso Avanzado

Adicional a los usos básicos, existen algunos atributos que permiten la personalización: 

el atributo `transition` permite personalizar la animación con la que el Tooltip se muestra o se esconda, el valor por defecto es `el-fade-in-linear`.

el atributo `disabled` permite deshabilitar `tooltip`. Solo es necesario definirlo como `true`.

De hecho, Tooltip es una extensión basada en [Vue-popper](https://github.com/element-component/vue-popper), es posible utilizar cualquier atributo permitido en Vue-popper.

:::demo
```html
<template>
  <hzq-tooltip :disabled="disabled" content="click to close tooltip function" placement="bottom" effect="light">
    <hzq-button @click="disabled = !disabled">click to {{disabled ? 'active' : 'close'}} tooltip function</hzq-button>
  </hzq-tooltip>
</template>

<script>
  export default {
    data() {
      return {
        disabled: false
      };
    }
  };
</script>

<style>
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .expand-fade-leave-active {
    margin-left: 20px;
    opacity: 0;
  }
</style>
```
:::

:::tip
El componente `router-link` no es soportado por Tooltip, favor de usar `vm.$router.push`.

Elementos de forma deshabilitados no son soportados por Tooltip, más información puede ser encontrada en [MDN](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter).
Es necesario envolver los elementos de forma deshabilitados en un elemento contenedor para que Tooltip funcione.
:::


### Atributos
| Atributo       | Descripción                              | Tipo    | Valores aceptados                        | Por defecto                              |
| -------------- | ---------------------------------------- | ------- | ---------------------------------------- | ---------------------------------------- |
| effect         | tema del Tooltip                         | string  | dark/light                               | dark                                     |
| content        | contenido a mostrar, puede ser sobre-escrito por `slot#content` | string  | —                                        | —                                        |
| placement      | posición del Tooltip                     | string  | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom                                   |
| value / v-model | visibilidad del Tooltip                  | boolean | —                                        | false                                    |
| disabled       | saber si el Tooltip se encuentra deshabilitado | boolean | —                                        | false                                    |
| offset         | offset del Tooltip                       | number  | —                                        | 0                                        |
| transition     | nombre de animación                      | string  | —                                        | el-fade-in-linear                        |
| visible-arrow  | si una flecha es mostrada. Para mayor información, revisar la página de [Vue-popper](https://github.com/element-component/vue-popper) | boolean | —                                        | true                                     |
| popper-options | parámetros de [popper.js](https://popper.js.org/docs/v2/) | Object  | referirse a la documentación de [popper.js](https://popper.js.org/docs/v2/) | `{ boundariesElement: 'body', gpuAcceleration: false }` |
| open-delay     | retraso de la apariencia, en mili segundos | number  | —                                        | 0                                        |
| manual         | si el Tooltipo será controlado de forma manual. `mouseenter` y `mouseleave` no tendrán efecto si fue establecido como `true` | boolean | —                                        | false                                    |
| popper-class   | nombre de clase personalizada para el popper del Tooltip | string  | —                                        | —                                        |
| enterable      | si el ratón puede entrar al Tooltip | Boolean | —                                        | true                                     |
| hide-after     | tiempo a esperar en mili segundos para esconder el Tooltip | number  | —                                        | 0                                        |
| tabindex       | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) de Tooltip | number   | —                      | 0              |
