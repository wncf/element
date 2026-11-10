## FormBuilder

Renderiza un formulario completo a partir de un array de configuración de campos. Los componentes de campo, sus `props`, eventos, slots, reglas de validación y el layout de columnas se declaran en la configuración, lo que resulta práctico en páginas CRUD con muchos formularios parecidos.

### Uso básico

:::demo Describa cada campo en `fields` y enlace el objeto de datos con `v-model`. Los valores se leen y escriben directamente sobre el objeto recibido (la misma referencia que el `model` de `hzq-form`), por lo que la validación siempre ve el valor más reciente. `prop` admite rutas anidadas como `user.name` y `list[0].id`. Sin `columns` cada campo ocupa una fila completa; con `columns` la fila se reparte en partes iguales.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
    :columns="2"
    :gutter="12"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date: '',
          online: false
        },
        fields: [
          {
            prop: 'name',
            label: 'Nombre',
            component: 'hzq-input',
            props: { placeholder: 'Nombre de la actividad' }
          },
          {
            prop: 'region',
            label: 'Zona',
            component: 'hzq-select',
            options: [
              { label: 'Zona uno', value: 'shanghai' },
              { label: 'Zona dos', value: 'beijing' }
            ]
          },
          {
            prop: 'date',
            label: 'Fecha',
            component: 'hzq-date-picker',
            props: { type: 'date', placeholder: 'Elegir fecha', valueFormat: 'yyyy-MM-dd' }
          },
          {
            prop: 'online',
            label: 'Actividad en línea',
            component: 'hzq-switch'
          }
        ]
      };
    }
  };
</script>
```
:::

### Validación

:::demo `required` genera automáticamente una regla «{label} no puede estar vacío» y escucha tanto `blur` como `change`; si sólo escuchara `blur`, el error seguiría visible hasta que el usuario hiciera clic en otro sitio. Las `rules` del campo se combinan con las `rules` del formulario por `prop` en vez de sobrescribirlas. Con `show-actions`, el botón de envío valida primero: emite `submit` si es válido e `invalid` si no lo es, de modo que sólo hay que mostrar un mensaje.
```html
<template>
  <div>
    <hzq-form-builder
      ref="builder"
      v-model="form"
      :fields="fields"
      :rules="rules"
      label-width="120px"
      :columns="2"
      :gutter="12"
      show-actions
      submit-text="Guardar"
      @submit="handleSubmit"
      @invalid="handleInvalid"
    />
    <p class="demo-result">{{ result }}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        result: 'Sin enviar',
        form: { name: '', amount: '' },
        rules: {
          name: [{ min: 2, max: 20, message: 'La longitud debe ser de 2 a 20', trigger: 'blur' }]
        },
        fields: [
          { prop: 'name', label: 'Nombre', component: 'hzq-input', required: true },
          {
            prop: 'amount',
            label: 'Importe',
            component: 'hzq-input',
            required: true,
            requiredMessage: 'El importe es obligatorio',
            rules: [{ pattern: /^\d+$/, message: 'Sólo números', trigger: 'change' }]
          }
        ]
      };
    },
    methods: {
      handleSubmit(model) {
        this.result = 'Enviado: ' + JSON.stringify(model);
      },
      handleInvalid() {
        this.result = 'Complete los campos obligatorios';
      }
    }
  };
</script>

<style>
  .demo-result {
    margin: 8px 0 0;
    font-size: 13px;
    color: #909399;
  }
</style>
```
:::

### Datos de opciones

:::demo Si `hzq-select`, `hzq-radio-group` o `hzq-checkbox-group` reciben `options`, los hijos `hzq-option`, `hzq-radio` y `hzq-checkbox` se renderizan solos. Cuando el origen usa otros nombres de campo, mapéelos con `optionProps` y podrá pasar la respuesta de la API tal cual.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { region: '', level: 'normal', tags: [] },
        fields: [
          {
            prop: 'region',
            label: 'Zona',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { name: 'Zona uno', code: 'shanghai' },
              { name: 'Zona dos', code: 'beijing' },
              { name: 'Zona tres', code: 'shenzhen', off: true }
            ],
            optionProps: { label: 'name', value: 'code', disabled: 'off' }
          },
          {
            prop: 'level',
            label: 'Nivel',
            component: 'hzq-radio-group',
            options: [
              { label: 'Normal', value: 'normal' },
              { label: 'Urgente', value: 'urgent' }
            ]
          },
          {
            prop: 'tags',
            label: 'Etiquetas',
            component: 'hzq-checkbox-group',
            options: [
              { label: 'Importante', value: 'important' },
              { label: 'Largo plazo', value: 'longterm' }
            ]
          }
        ]
      };
    }
  };
</script>
```
:::

### Campos enlazados

:::demo `hidden` y `disabled` aceptan un booleano o una función `(model) => boolean`. La forma de función se recalcula cuando cambian los datos; ocultar un campo sólo evita su renderizado, el valor en `model` se conserva.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
    :columns="2"
    :gutter="12"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { type: 'fixed', amount: '', remark: '' },
        fields: [
          {
            prop: 'type',
            label: 'Facturación',
            component: 'hzq-select',
            options: [
              { label: 'Importe fijo', value: 'fixed' },
              { label: 'Pago por uso', value: 'dynamic' }
            ]
          },
          {
            prop: 'amount',
            label: 'Importe',
            component: 'hzq-input',
            tip: 'No es necesario con pago por uso',
            hidden: model => model.type === 'dynamic',
            disabled: model => !model.type
          },
          {
            prop: 'remark',
            label: 'Observaciones',
            component: 'hzq-input',
            disabled: model => model.type === 'dynamic'
          }
        ]
      };
    }
  };
</script>
```
:::

### Slots personalizados

:::demo Tres formas de tomar el control: `slot` reemplaza el campo completo (su scope expone `setValue`, que escribe de nuevo en `model`); `labelSlot` reemplaza el contenido de la etiqueta; `slots` reenvía slots al componente del campo, como `prefix` de `hzq-input`. `slots` acepta un array (mismo nombre) o un objeto (nombre del slot destino → su slot).
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
  >
    <template slot="amountLabel" slot-scope="scope">★{{ scope.field.label }}</template>
    <template slot="amount" slot-scope="scope">
      <hzq-input-number
        :value="Number(scope.value) || 0"
        :min="0"
        @change="scope.setValue"
      />
    </template>
    <template slot="remark" slot-scope="scope">
      <hzq-input
        :value="scope.value"
        type="textarea"
        :rows="2"
        placeholder="Campo con slot personalizado"
        @input="scope.setValue"
      />
    </template>
    <span slot="namePrefix">$</span>
  </hzq-form-builder>
</template>

<script>
  export default {
    data() {
      return {
        form: { name: '', amount: '', remark: '' },
        fields: [
          {
            prop: 'name',
            label: 'Nombre',
            component: 'hzq-input',
            slots: { prefix: 'namePrefix' }
          },
          { prop: 'amount', label: 'Importe', labelSlot: 'amountLabel', slot: 'amount' },
          { prop: 'remark', label: 'Observaciones', slot: 'remark' }
        ]
      };
    }
  };
</script>
```
:::

### Grupos y layout

:::demo Una entrada con `type: 'title'` se renderiza como título de grupo y `type: 'divider'` como `hzq-divider`. Ambas son sólo visuales y quedan fuera de los datos y de la validación. Sin `columns` puede usar `span` para ocupar 24 columnas antes de saltar de línea; `gutter` fija el espacio horizontal.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
    :gutter="16"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { name: '', phone: '', email: '', address: '' },
        fields: [
          { type: 'title', label: 'Datos básicos' },
          { prop: 'name', label: 'Nombre', component: 'hzq-input', span: 12 },
          { prop: 'phone', label: 'Teléfono', component: 'hzq-input', span: 12 },
          { type: 'divider', label: 'Contacto' },
          { prop: 'email', label: 'Correo', component: 'hzq-input' },
          { prop: 'address', label: 'Dirección', component: 'hzq-input' }
        ]
      };
    }
  };
</script>
```
:::

### Eventos de campo

:::demo `events` en un campo asocia nombres de evento con manejadores. Cada manejador recibe como último argumento un objeto de contexto `ctx` (`field`, `model`, `prop`, `value`), así el código de negocio no tiene que capturarlos en el closure.
```html
<template>
  <div>
    <hzq-form-builder
      v-model="form"
      :fields="fields"
      label-width="120px"
    />
    <p class="demo-result">{{ log || 'Esperando acción' }}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        log: '',
        form: { locked: false, region: '' },
        fields: [
          {
            prop: 'locked',
            label: 'Bloqueado',
            component: 'hzq-switch',
            events: {
              change: (value, ctx) => {
                this.log = `El campo "${ctx.field.label}" cambió a ${value}`;
                // los manejadores por función ya llevan el model, enlazar es directo
                if (value) ctx.model.region = '';
              }
            }
          },
          {
            prop: 'region',
            label: 'Zona',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { label: 'Zona uno', value: 'shanghai' },
              { label: 'Zona dos', value: 'beijing' }
            ]
          }
        ]
      };
    }
  };
</script>

<style>
  .demo-result {
    margin: 8px 0 0;
    font-size: 13px;
    color: #909399;
  }
</style>
```
:::

### Atributos de FormBuilder

| Atributo | Descripción | Tipo | Valores aceptados | Por defecto |
| ---------- | -------------- | ---------- | --- | -------- |
| value / v-model | Datos del formulario. Se actualizan en sitio, sin copia | object | — | {} |
| fields | Configuración de campos, una entrada por ítem, ver Atributos de campo | array | — | [] |
| rules | Reglas de validación del formulario, se combinan con las de cada campo por `prop` | object | — | {} |
| label-width | Ancho de la etiqueta, se pasa a `hzq-form` | string | — | — |
| label-position | Posición de la etiqueta | string | right / left / top | right |
| label-suffix | Sufijo de la etiqueta | string | — | '' |
| inline | Si el formulario es inline | boolean | — | false |
| inline-message | Si el mensaje de error se muestra en línea | boolean | — | false |
| status-icon | Si se muestra un icono de estado de validación en el campo | boolean | — | false |
| hide-required-asterisk | Si se oculta el asterisco de los campos obligatorios | boolean | — | false |
| validate-on-rule-change | Si se valida de inmediato cuando cambian las reglas | boolean | — | true |
| size | Tamaño de los controles del formulario | string | large / medium / small / mini | — |
| disabled | Si se deshabilita todo el formulario | boolean | — | false |
| show-message | Si se muestra el mensaje de error | boolean | — | true |
| columns | Número de columnas por fila. Al definirlo se reparte en partes iguales e ignora `span` | number | — | 0 |
| gutter | Separación horizontal entre columnas, en píxeles | number | — | 0 |
| show-actions | Si se renderizan los botones de envío y reinicio | boolean | — | false |
| submit-text | Texto del botón de envío | string | — | 提交 |
| reset-text | Texto del botón de reinicio | string | — | 重置 |
| loading | Estado de carga del botón de envío | boolean | — | false |

### Atributos de campo

Cada entrada del array `fields`:

| Atributo | Descripción | Tipo | Valores aceptados | Por defecto |
| ---------- | -------------- | ---------- | --- | -------- |
| prop | Ruta del valor en el objeto de datos, admite `a.b` y `list[0].id` | string | — | — |
| label | Texto de la etiqueta | string | — | — |
| component | Componente del campo: nombre registrado globalmente (`hzq-select`) u objeto de componente. Si se omite, se usa `slot` | string / object | — | — |
| props | Props que se pasan al componente del campo | object | — | — |
| events | nombre de evento → manejador, recibe además un `ctx` (`{ field, model, prop, value }`) | object | — | — |
| slots | Slots reenviados al componente del campo. `['prefix']` mantiene el nombre, `{ prefix: 'myPrefix' }` lo mapea a su slot | array / object | — | — |
| options | Datos de opciones. Se renderizan como `hzq-option` / `hzq-radio` / `hzq-checkbox` automáticamente | array | — | — |
| optionProps | Mapa de nombres de campo de las opciones, p. ej. `{ label: 'name', value: 'id' }` | object | — | — |
| optionComponent | Nombre del componente hijo de opciones, se deduce de `component` | string | — | — |
| required | Si se genera automáticamente la regla de obligatorio | boolean | — | false |
| requiredMessage | Mensaje de la regla generada, por defecto «{label} no puede estar vacío» | string | — | — |
| rules | Reglas de validación del campo, se combinan con `required` y las `rules` del formulario | array | — | — |
| span | Ocupación en la grilla de 24 columnas, sólo si no se define `columns` | number | — | 24 |
| hidden | Si se oculta el campo. Oculto no se renderiza pero conserva su valor | boolean / function(model) | — | false |
| disabled | Si se deshabilita el campo. La forma de función se recalcula al cambiar los datos | boolean / function(model) | — | false |
| tip | Texto de ayuda bajo el campo | string | — | — |
| type | Tipo de entrada | string | field / title / divider | field |
| slot | Renderiza este campo con uno de sus slots, tiene la máxima prioridad | string | — | — |
| labelSlot | Renderiza la etiqueta con uno de sus slots | string | — | — |
| contentPosition | Posición del texto del divisor, sólo con `type="divider"` | string | left / center / right | left |
| key | Clave para el renderizado de listas, por defecto `prop` | string | — | — |

### Eventos de FormBuilder

| Nombre del evento | Descripción | Parámetros del callback |
| ---------- | -------------- | ---------- |
| submit | Se emite al pulsar enviar y si el formulario es válido | (model) |
| invalid | Se emite al pulsar enviar y si el formulario no es válido | — |
| reset | Se emite al pulsar reiniciar, se reinician los campos y la validación | (model) |
| field-change | Se emite cuando cambia el valor de un campo | (prop, value, model) |

### Slots de FormBuilder

| Nombre | Descripción | Scope |
| ---------- | -------------- | ---------- |
| title | Contenido de una entrada `type="title"` | { field } |
| — | Cualquier slot con nombre referenciado por `field.slot`, `field.labelSlot` o `field.slots` | { field, model, value, setValue } |

### Métodos de FormBuilder

| Método | Descripción | Parámetros |
| ---------- | -------------- | ---------- |
| validate | Valida todo el formulario, mismo comportamiento que `hzq-form` | (callback) |
| validateField | Valida campos concretos | (props, callback) |
| resetFields | Reinicia todos los campos y limpia la validación | — |
| clearValidate | Limpia la validación de campos concretos | (props) |
