## FormBuilder

Construit un formulaire complet à partir d'un tableau de configuration de champs. Composants, props, événements, slots, règles de validation et grille sont tous décrits dans la configuration, ce qui convient aux pages CRUD dont les formulaires se ressemblent.

### Utilisation basique

:::demo Décrivez chaque champ dans `fields` et liez l'objet de données avec `v-model`. Les valeurs sont lues et écrites directement dans l'objet passé (même référence que le `model` de `hzq-form`), la validation voit donc toujours la valeur à jour. `prop` accepte les chemins imbriqués comme `user.name` ou `list[0].id`. Sans `columns`, chaque champ occupe une ligne entière ; avec `columns`, la ligne est découpée à parts égales.
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
            label: "Nom de l'activité",
            component: 'hzq-input',
            props: { placeholder: "Nom de l'activité" }
          },
          {
            prop: 'region',
            label: "Zone d'activité",
            component: 'hzq-select',
            options: [
              { label: 'Zone une', value: 'shanghai' },
              { label: 'Zone deux', value: 'beijing' }
            ]
          },
          {
            prop: 'date',
            label: "Date de l'activité",
            component: 'hzq-date-picker',
            props: { type: 'date', placeholder: 'Choisir une date', valueFormat: 'yyyy-MM-dd' }
          },
          {
            prop: 'online',
            label: 'Activité en ligne',
            component: 'hzq-switch'
          }
        ]
      };
    }
  };
</script>
```
:::

### Validation

:::demo `required` génère une règle « {label} ne peut pas être vide » et écoute à la fois `blur` et `change` ; avec `blur` seul, l'erreur reste affichée jusqu'au prochain clic ailleurs. Les `rules` du champ sont fusionnées avec celles du formulaire par `prop` au lieu de les remplacer. Avec `show-actions`, le bouton de soumission valide d'abord : il émet `submit` si tout est valide et `invalid` sinon, vous n'affichez donc qu'un seul message.
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
      submit-text="Enregistrer"
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
        result: 'Pas encore soumis',
        form: { name: '', amount: '' },
        rules: {
          name: [{ min: 2, max: 20, message: 'Entre 2 et 20 caractères', trigger: 'blur' }]
        },
        fields: [
          { prop: 'name', label: 'Nom', component: 'hzq-input', required: true },
          {
            prop: 'amount',
            label: 'Montant',
            component: 'hzq-input',
            required: true,
            requiredMessage: 'Le montant est obligatoire',
            rules: [{ pattern: /^\d+$/, message: 'Chiffres uniquement', trigger: 'change' }]
          }
        ]
      };
    },
    methods: {
      handleSubmit(model) {
        this.result = 'Envoyé : ' + JSON.stringify(model);
      },
      handleInvalid() {
        this.result = 'Veuillez compléter les champs obligatoires';
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

### Données d'options

:::demo Donnez un tableau `options` à `hzq-select`, `hzq-radio-group` ou `hzq-checkbox-group` et les enfants `hzq-option`, `hzq-radio` et `hzq-checkbox` correspondants sont rendus automatiquement. Si la source utilise d'autres noms de clés, mappez-les avec `optionProps` : une réponse d'API peut être passée telle quelle.
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
            label: 'Zone',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { name: 'Zone une', code: 'shanghai' },
              { name: 'Zone deux', code: 'beijing' },
              { name: 'Zone trois', code: 'shenzhen', off: true }
            ],
            optionProps: { label: 'name', value: 'code', disabled: 'off' }
          },
          {
            prop: 'level',
            label: 'Niveau',
            component: 'hzq-radio-group',
            options: [
              { label: 'Normal', value: 'normal' },
              { label: 'Urgent', value: 'urgent' }
            ]
          },
          {
            prop: 'tags',
            label: 'Étiquettes',
            component: 'hzq-checkbox-group',
            options: [
              { label: 'Important', value: 'important' },
              { label: 'Long terme', value: 'longterm' }
            ]
          }
        ]
      };
    }
  };
</script>
```
:::

### Champs liés

:::demo `hidden` et `disabled` acceptent un booléen ou une fonction `(model) => boolean`. La forme fonction est recalculée quand les données changent ; masquer un champ empêche seulement son rendu, la valeur dans `model` est conservée.
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
            label: 'Facturation',
            component: 'hzq-select',
            options: [
              { label: 'Montant fixe', value: 'fixed' },
              { label: 'À l\'usage', value: 'dynamic' }
            ]
          },
          {
            prop: 'amount',
            label: 'Montant',
            component: 'hzq-input',
            tip: 'Inutile pour la facturation à l\'usage',
            hidden: model => model.type === 'dynamic',
            disabled: model => !model.type
          },
          {
            prop: 'remark',
            label: 'Remarque',
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

### Slots personnalisés

:::demo Trois façons de prendre la main : `slot` remplace tout le champ (sa portée expose `setValue`, qui réécrit dans `model`) ; `labelSlot` remplace le contenu du label ; `slots` transmet des slots au composant du champ, comme `prefix` de `hzq-input`. `slots` accepte un tableau (même nom) ou un objet (nom du slot cible → votre slot).
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
        placeholder="Champ avec slot personnalisé"
        @input="scope.setValue"
      />
    </template>
    <span slot="namePrefix">€</span>
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
            label: 'Nom',
            component: 'hzq-input',
            slots: { prefix: 'namePrefix' }
          },
          { prop: 'amount', label: 'Montant', labelSlot: 'amountLabel', slot: 'amount' },
          { prop: 'remark', label: 'Remarque', slot: 'remark' }
        ]
      };
    }
  };
</script>
```
:::

### Groupes et mise en page

:::demo Une entrée `type: 'title'` devient un titre de groupe et `type: 'divider'` un `hzq-divider`. Les deux sont purement visuels et restent hors des données et de la validation. Sans `columns`, `span` remplit les 24 colonnes de la grille avant le retour à la ligne ; `gutter` règle l'espacement horizontal.
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
          { type: 'title', label: 'Informations de base' },
          { prop: 'name', label: 'Nom', component: 'hzq-input', span: 12 },
          { prop: 'phone', label: 'Téléphone', component: 'hzq-input', span: 12 },
          { type: 'divider', label: 'Contact' },
          { prop: 'email', label: 'E-mail', component: 'hzq-input' },
          { prop: 'address', label: 'Adresse', component: 'hzq-input' }
        ]
      };
    }
  };
</script>
```
:::

### Événements de champ

:::demo `events` associe des noms d'événements à des gestionnaires. Chaque gestionnaire reçoit en dernier argument un objet de contexte `ctx` (`field`, `model`, `prop`, `value`), le code métier n'a donc pas à les capturer dans la fermeture.
```html
<template>
  <div>
    <hzq-form-builder
      v-model="form"
      :fields="fields"
      label-width="120px"
    />
    <p class="demo-result">{{ log || 'En attente d\'une action' }}</p>
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
            label: 'Verrouillé',
            component: 'hzq-switch',
            events: {
              change: (value, ctx) => {
                this.log = `Le champ « ${ctx.field.label} » vaut ${value}`;
                // les gestionnaires fonctions portent déjà le model, la liaison est directe
                if (value) ctx.model.region = '';
              }
            }
          },
          {
            prop: 'region',
            label: 'Zone',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { label: 'Zone une', value: 'shanghai' },
              { label: 'Zone deux', value: 'beijing' }
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

### Attributs de FormBuilder

| Attribut | Description | Type | Valeurs acceptées | Défaut |
| ---------- | -------------- | ---------- | --- | -------- |
| value / v-model | Données du formulaire. Mises à jour sur place, sans copie | object | — | {} |
| fields | Configuration des champs, une entrée par champ, voir Attributs de champ | array | — | [] |
| rules | Règles de validation du formulaire, fusionnées avec celles de chaque champ par `prop` | object | — | {} |
| label-width | Largeur du label, transmise à `hzq-form` | string | — | — |
| label-position | Position du label | string | right / left / top | right |
| label-suffix | Suffixe du label | string | — | '' |
| inline | Si le formulaire est en ligne | boolean | — | false |
| inline-message | Si le message d'erreur s'affiche en ligne | boolean | — | false |
| status-icon | Si une icône d'état de validation s'affiche dans le champ | boolean | — | false |
| hide-required-asterisk | Si l'astérisque des champs obligatoires est masqué | boolean | — | false |
| validate-on-rule-change | Si la validation se relance dès que les règles changent | boolean | — | true |
| size | Taille des contrôles du formulaire | string | large / medium / small / mini | — |
| disabled | Si tout le formulaire est désactivé | boolean | — | false |
| show-message | Si le message d'erreur est affiché | boolean | — | true |
| columns | Nombre de colonnes par ligne. Défini, les champs sont répartis à parts égales et `span` est ignoré | number | — | 0 |
| gutter | Espacement horizontal entre colonnes, en pixels | number | — | 0 |
| show-actions | Si les boutons de soumission et de réinitialisation sont rendus | boolean | — | false |
| submit-text | Texte du bouton de soumission | string | — | 提交 |
| reset-text | Texte du bouton de réinitialisation | string | — | 重置 |
| loading | État de chargement du bouton de soumission | boolean | — | false |

### Attributs de champ

Chaque entrée du tableau `fields` :

| Attribut | Description | Type | Valeurs acceptées | Défaut |
| ---------- | -------------- | ---------- | --- | -------- |
| prop | Chemin de la valeur dans l'objet de données, accepte `a.b` et `list[0].id` | string | — | — |
| label | Texte du label | string | — | — |
| component | Composant du champ : un nom enregistré globalement (`hzq-select`) ou un objet composant. Laissé vide, le rendu revient à `slot` | string / object | — | — |
| props | Props transmises au composant du champ | object | — | — |
| events | nom d'événement → gestionnaire, le gestionnaire reçoit en plus un `ctx` (`{ field, model, prop, value }`) | object | — | — |
| slots | Slots transmis au composant du champ. `['prefix']` garde le nom, `{ prefix: 'myPrefix' }` le mappe sur votre slot | array / object | — | — |
| options | Données d'options. Rendues en `hzq-option` / `hzq-radio` / `hzq-checkbox` automatiquement | array | — | — |
| optionProps | Mapping des noms de champs des options, p. ex. `{ label: 'name', value: 'id' }` | object | — | — |
| optionComponent | Nom du composant enfant des options, déduit de `component` par défaut | string | — | — |
| required | Si la règle d'obligation est générée automatiquement | boolean | — | false |
| requiredMessage | Message de la règle générée, par défaut « {label} ne peut pas être vide » | string | — | — |
| rules | Règles de validation du champ, fusionnées avec `required` et les `rules` du formulaire | array | — | — |
| span | Occupation sur la grille de 24 colonnes, seulement sans `columns` | number | — | 24 |
| hidden | Si le champ est masqué. Masqué, il n'est pas rendu mais conserve sa valeur | boolean / function(model) | — | false |
| disabled | Si le champ est désactivé. La forme fonction est recalculée au changement des données | boolean / function(model) | — | false |
| tip | Texte d'aide sous le champ | string | — | — |
| type | Type d'entrée | string | field / title / divider | field |
| slot | Rend ce champ avec un de vos slots, priorité maximale | string | — | — |
| labelSlot | Rend le label avec un de vos slots | string | — | — |
| contentPosition | Position du texte du séparateur, seulement avec `type="divider"` | string | left / center / right | left |
| key | Clé de rendu de liste, `prop` par défaut | string | — | — |

### Événements de FormBuilder

| Nom | Description | Paramètres |
| ---------- | -------------- | ---------- |
| submit | Émis au clic sur soumettre si le formulaire est valide | (model) |
| invalid | Émis au clic sur soumettre si le formulaire n'est pas valide | — |
| reset | Émis au clic sur réinitialiser, champs et validation sont réinitialisés | (model) |
| field-change | Émis quand la valeur d'un champ change | (prop, value, model) |

### Slots de FormBuilder

| Nom | Description | Portée |
| ---------- | -------------- | ---------- |
| title | Contenu d'une entrée `type="title"` | { field } |
| — | Tout slot nommé référencé par `field.slot`, `field.labelSlot` ou `field.slots` | { field, model, value, setValue } |

### Méthodes de FormBuilder

| Méthode | Description | Paramètres |
| ---------- | -------------- | ---------- |
| validate | Valide tout le formulaire, même comportement que `hzq-form` | (callback) |
| validateField | Valide des champs précis | (props, callback) |
| resetFields | Réinitialise tous les champs et efface la validation | — |
| clearValidate | Efface la validation de champs précis | (props) |
