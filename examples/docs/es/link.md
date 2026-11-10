## Link

Texto con hipervínculo

### Básico

Texto con hipervínculo básico
:::demo

```html
<div>
  <hzq-link href="https://element.eleme.io" target="_blank">default</hzq-link>
  <hzq-link type="primary">primary</hzq-link>
  <hzq-link type="success">success</hzq-link>
  <hzq-link type="warning">warning</hzq-link>
  <hzq-link type="danger">danger</hzq-link>
  <hzq-link type="info">info</hzq-link>
</div>
```

:::

### Deshabilitar

Deshabilita el hipervínculo
:::demo

```html
<div>
  <hzq-link disabled>default</hzq-link>
  <hzq-link type="primary" disabled>primary</hzq-link>
  <hzq-link type="success" disabled>success</hzq-link>
  <hzq-link type="warning" disabled>warning</hzq-link>
  <hzq-link type="danger" disabled>danger</hzq-link>
  <hzq-link type="info" disabled>info</hzq-link>
</div>
```

:::

### Subrayado

Subrayado del hipervínculo
:::demo

```html
<div>
  <hzq-link :underline="false">Without Underline</hzq-link>
  <hzq-link>With Underline</hzq-link>
</div>
```

:::

### Icono

Hipervínculo con icono
:::demo

```html
<div>
  <hzq-link icon="hzq-icon-edit">Edit</hzq-link>
  <hzq-link>Check<i class="hzq-icon-view hzq-icon--right"></i> </hzq-link>
</div>
```

:::

### Atributos

| Atributo  | Descripción                                          | Tipo    | Opciones                                    | Por defecto |
| --------- | ---------------------------------------------------- | ------- | ------------------------------------------- | ----------- |
| type      | tipo                                                 | string  | primary / success / warning / danger / info | default     |
| underline | si el hipervínculo estará subrayado                  | boolean | —                                           | true        |
| disabled  | si el componente esta deshabilitado                  | boolean | —                                           | false       |
| href      | lo mismo que el valor nativo del hipervínculo `href` | string  | —                                           | -           |
| icon      | nombre de clase del icono                            | string  | —                                           | -           |
