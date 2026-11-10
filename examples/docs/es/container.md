## Contenedor
Componentes contenedores para iniciar una estructura básica de un sitio:

`<hzq-container>`: Contenedor. Cuando este elemento se anida con un `<hzq-header>` o `<hzq-footer>`, todos los elementos secundarios se organizan verticalmente.
De lo contrario, de forma horizontal. 

`<hzq-header>`: Contenedor para cabeceras.

`<hzq-aside>`: Contenedor para secciones laterales (generalmente, una barra lateral).

`<hzq-main>`: Contenedor para sección principal.

`<hzq-footer>`: Contenedor para pie de página.

:::tip
Estos componentes utilizan flex para el diseño, así que asegúrese que el navegador lo soporta. Además, los elementos directos de `<hzq-container>` tienen que ser uno o más de los últimos cuatro componentes. Y el elemento padre de los últimos cuatro componentes debe ser un `<hzq-container>`.
:::

### Diseños comunes

:::demo
```html
<hzq-container>
  <hzq-header>Cabecera</hzq-header>
  <hzq-main>Principal</hzq-main>
</hzq-container>

<hzq-container>
  <hzq-header>Cabecera</hzq-header>
  <hzq-main>Principal</hzq-main>
  <hzq-footer>Pie de página</hzq-footer>
</hzq-container>

<hzq-container>
  <hzq-aside width="200px">Barra lateral</hzq-aside>
  <hzq-main>Principal</hzq-main>
</hzq-container>

<hzq-container>
  <hzq-header>Cabecera</hzq-header>
  <hzq-container>
    <hzq-aside width="200px">Barra lateral</hzq-aside>
    <hzq-main>Principal</hzq-main>
  </hzq-container>
</hzq-container>

<hzq-container>
  <hzq-header>Cabecera</hzq-header>
  <hzq-container>
    <hzq-aside width="200px">Barra lateral</hzq-aside>
    <hzq-container>
      <hzq-main>Principal</hzq-main>
      <hzq-footer>Pie de página</hzq-footer>
    </hzq-container>
  </hzq-container>
</hzq-container>

<hzq-container>
  <hzq-aside width="200px">Barra lateral</hzq-aside>
  <hzq-container>
    <hzq-header>Cabecera</hzq-header>
    <hzq-main>Principal</hzq-main>
  </hzq-container>
</hzq-container>

<hzq-container>
  <hzq-aside width="200px">Barra lateral</hzq-aside>
  <hzq-container>
    <hzq-header>Cabecera</hzq-header>
    <hzq-main>Principal</hzq-main>
    <hzq-footer>Pie de página</hzq-footer>
  </hzq-container>
</hzq-container>

<style>
  .hzq-header, .hzq-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .hzq-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .hzq-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .hzq-container {
    margin-bottom: 40px;
  }
  
  .hzq-container:nth-child(5) .hzq-aside,
  .hzq-container:nth-child(6) .hzq-aside {
    line-height: 260px;
  }
  
  .hzq-container:nth-child(7) .hzq-aside {
    line-height: 320px;
  }
</style>
```
:::

### Ejemplo

:::demo
```html
<hzq-container style="height: 500px; border: 1px solid #eee">
  <hzq-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <hzq-menu :default-openeds="['1', '3']">
      <hzq-submenu index="1">
        <template slot="title"><i class="hzq-icon-message"></i>Navigator One</template>
        <hzq-menu-item-group>
          <template slot="title">Group 1</template>
          <hzq-menu-item index="1-1">Option 1</hzq-menu-item>
          <hzq-menu-item index="1-2">Option 2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group 2">
          <hzq-menu-item index="1-3">Option 3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="1-4">
          <template slot="title">Option4</template>
          <hzq-menu-item index="1-4-1">Option 4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-submenu index="2">
        <template slot="title"><i class="hzq-icon-menu"></i>Navigator Two</template>
        <hzq-menu-item-group>
          <template slot="title">Group 1</template>
          <hzq-menu-item index="2-1">Option 1</hzq-menu-item>
          <hzq-menu-item index="2-2">Option 2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group 2">
          <hzq-menu-item index="2-3">Option 3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="2-4">
          <template slot="title">Option 4</template>
          <hzq-menu-item index="2-4-1">Option 4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-submenu index="3">
        <template slot="title"><i class="hzq-icon-setting"></i>Navigator Three</template>
        <hzq-menu-item-group>
          <template slot="title">Group 1</template>
          <hzq-menu-item index="3-1">Option 1</hzq-menu-item>
          <hzq-menu-item index="3-2">Option 2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group 2">
          <hzq-menu-item index="3-3">Option 3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="3-4">
          <template slot="title">Option 4</template>
          <hzq-menu-item index="3-4-1">Option 4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
    </hzq-menu>
  </hzq-aside>
  
  <hzq-container>
    <hzq-header style="text-align: right; font-size: 12px">
      <hzq-dropdown>
        <i class="hzq-icon-setting" style="margin-right: 15px"></i>
        <hzq-dropdown-menu slot="dropdown">
          <hzq-dropdown-item>View</hzq-dropdown-item>
          <hzq-dropdown-item>Add</hzq-dropdown-item>
          <hzq-dropdown-item>Delete</hzq-dropdown-item>
        </hzq-dropdown-menu>
      </hzq-dropdown>
      <span>Tom</span>
    </hzq-header>
    
    <hzq-main>
      <hzq-table :data="tableData">
        <hzq-table-column prop="date" label="Date" width="140">
        </hzq-table-column>
        <hzq-table-column prop="name" label="Name" width="120">
        </hzq-table-column>
        <hzq-table-column prop="address" label="Address">
        </hzq-table-column>
      </hzq-table>
    </hzq-main>
  </hzq-container>
</hzq-container>

<style>
  .hzq-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .hzq-aside {
    color: #333;
  }
</style>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      };
      return {
        tableData: Array(20).fill(item)
      }
    }
  };
</script>
```
:::

### Atributos de contenedor
| Atributo  | Descripción                              | Tipo   | Valores aceptados     | Por defecto                              |
| --------- | ---------------------------------------- | ------ | --------------------- | ---------------------------------------- |
| direction | dirección de diseño para elementos secundarios | string | horizontal / vertical | vertical cuando el elemento está anidado con `hzq-header`, de lo contrario, horizontal |

### Atributos de cabecera
| Atributo | Descripción           | Tipo   | Valores aceptados | Por defecto |
| -------- | --------------------- | ------ | ----------------- | ----------- |
| height   | altura de la cabecera | string | —                 | 60px        |

### Atributos de barra lateral
| Atributo | Descripción               | Tipo   | Valores aceptados | Por defecto |
| -------- | ------------------------- | ------ | ----------------- | ----------- |
| width    | ancho de la barra lateral | string | —                 | 300px       |

### Atributos de pie de página
| Atributo | Descripción              | Tipo   | Valores aceptados | Por defecto |
| -------- | ------------------------ | ------ | ----------------- | ----------- |
| height   | altura del pie de página | string | —                 | 60px        |