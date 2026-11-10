## Breadcrumb

Muestra la localización de la página actual, haciendo más fácil el poder ir a la página anterior.

### Uso básico


:::demo En `hzq-breadcrumb`, cada `hzq-breadcrumb-item` es un tag que representa cada nivel empezando desde la homepage. Este componente tiene un atributo `String` llamado `separator`, el mismo determina el carácter separador. El valor por defecto es '/'.

```html
<hzq-breadcrumb separator="/">
  <hzq-breadcrumb-item :to="{ path: '/' }">homepage</hzq-breadcrumb-item>
  <hzq-breadcrumb-item><a href="/">promotion management</a></hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion list</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion detail</hzq-breadcrumb-item>
</hzq-breadcrumb>
```
:::

### Icono separador

:::demo Setee `separator-class` para que utilice `iconfont` como separador，el mismo va a cubrir `separator`

```html
<hzq-breadcrumb separator-class="hzq-icon-arrow-right">
  <hzq-breadcrumb-item :to="{ path: '/' }">homepage</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion management</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion list</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion detail</hzq-breadcrumb-item>
</hzq-breadcrumb>
```
:::

### Breadcrumb atributos
| Atributo        | Descripción                            | Tipo   | Valores aceptados | Por defecto |
| --------------- | -------------------------------------- | ------ | ----------------- | ----------- |
| separator       | carácter separador                     | string | —                 | /           |
| separator-class | nombre de la clase del icono separador | string | —                 | -           |

### Breadcrumb Item atributos
| Atributo | Descripción                              | Tipo          | Valores aceptados | Por defecto |
| -------- | ---------------------------------------- | ------------- | ----------------- | ----------- |
| to       | ruta del link, lo mismo que `to` de `vue-router` | string/object | —                 | —           |
| replace  | si `true`,  la navegación no dejara una entrada en la historia | boolean       | —                 | false       |





