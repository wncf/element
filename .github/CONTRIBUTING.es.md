# Guía para Contribuidores a `Element UI`

¡Hola! Gracias por elegir [Element UI](http://element.eleme.io/#/en-US).

`Element UI` es un archivo de componentes para desarrolladores y para gerentes de productos ‘web’ basado en [Vue 2.0](https://vuejs.org/)

Estamos orgullosos de que usted esta interesado en contribuir al proyecto `Element`. Antes de someter sus contribuciones, por favor tome un momentito para leer estas simples guías para contribuidores.


## Guía Para Reportar Problemas (“Issues”)

- [“Issues”]( https://elementui.github.io/issue-generator) son exclusivamente para informar de errores, sugerencias o solicitaciones para funcionalidad adicional referente a diseño. Preguntas de otro tipo corren el riesgo de ser cerradas inmediatamente. Sí tiene preguntas sobre el uso de `Element`, vea [Gitter](https://gitter.im/element-en/Lobby) para más ayuda.

- Antes de someter un informe sobre algún problema, sírvase de revisar  sí ya hubo un informe.

- Por favor especifique que versión de `Element` y `Vue` que esta utilizando, y que versión de sistema operativo y que versión de navegador web que está utilizando. [JSFiddle](https://jsfiddle.net/) esta recomendado para crear un entorno para reproducir el problema claramente.


## Guías para un “Pull Request (PR)”

- Crea una bifurcación (“fork”) del repositorio a su propia cuenta en github.com. Por favor no crea ramas nuevas aquí.

- Cuando cometa su cambio, formatea en esta forma: `[Nombre de componente]: Datos sobre el “commit”.` (por ejemplo. `Button: Reparación de xxx error`)

- **DE NINGUNA MANERA** incluya archivos dentro del directorio `lib`.

- Asegúrese de que el comando `npm run dist` produzca los archivos correctos.

- Para asegurar compatibilidad y reducir tamaño de los archivos, nuestra configuración de `babel` solo importa `preset-2015`, así que IPAs como  Array.prototype.find` y `Object.assign` en `ES2015` no son recomendados. Puede importar “polyfills” terceros, sí es necesario.

- “Rebase” antes de crear un “pull request (PR)” para mantener la historia de “commits” limpia.

- Asegúrese que sus PRs se refrieran a la rama `dev`  y no a la rama  `master`.

- Si su PR arregla un error técnico, por favor, haga referencia al error especifico.

- Fusión de un PR requiere dos mantenedores: el primero aprueba los cambios después de revisar, y entonces el segundo mantenedor revisa los cambios y hace la fusión.


## Requerimientos Técnicos

### Requisitos

| Dependencia | Versión | Notas |
| --- | --- | --- |
| Node.js | 12.x (se recomienda 12.22.12) | El repositorio incluye `.nvmrc`; ejecute `nvm use` para cambiar |
| yarn | 1.x | **Obligatorio.** Las versiones están bloqueadas por `yarn.lock`; no use `npm install` |
| npm | 6+ | Solo se usa para ejecutar scripts `npm run xxx` |

Node 14 también funciona, pero `.nvmrc` es la referencia. Los estilos se compilan con dart-sass, por lo que **no hace falta instalar Python, node-gyp ni Visual Studio Build Tools**.

### Primera ejecución

```shell
git clone https://github.com/wncf/element.git
cd element

# cambie a la versión de Node indicada en .nvmrc (si usa nvm)
nvm use

# 1. instale las dependencias
yarn install

# 2. inicie el servidor de desarrollo
npm run dev

# abra http://localhost:8085
```

`npm run dev` ejecuta `yarn install`, `build:file` y `webpack-dev-server` en secuencia.

> **Nota**: `examples/pages/` se genera con `build:file` a partir de `examples/pages/template/` y no está versionado. Si inicia webpack sin ejecutar `build:file`, fallará con `Can't resolve './pages/zh-CN'`.

### Dos modos de desarrollo

Ambos escuchan el puerto `8085` y **no pueden ejecutarse a la vez**.

```shell
# Sitio de documentación: con rutas, documentación y demos completos
npm run dev

# Playground de componentes: una sola página, recarga más rápida
npm run dev:play
```

Ambos se sirven en [http://localhost:8085](http://localhost:8085). `dev:play` no tiene router y abre el playground; `dev` es el sitio de documentación, por ejemplo `http://localhost:8085/#/es/component/button`.

Modifique `examples/play/index.vue` para elegir qué componentes muestra el playground.

### Empaquetado

```shell
npm run dist
```

### Pruebas

```shell
npm run test
```

Primero ejecuta lint y compila el tema, luego corre las pruebas unitarias con Karma + Headless Chrome. Chrome debe estar instalado, o bien apunte `CHROME_BIN` a un ejecutable de navegador.

Se sabe que el caso `loading implies disabled` en `button.spec.js` falla en algunos entornos; no está relacionado con el código de negocio.

## Guía Para Desarrollo de Componentes
- Corra el comando `make new <component-name>` para crear el directorio de su proyecto para un componente nuevo. Verifique su código fuente test, archivo de entrada y documentación están incluidos.
- Refiérase al `Button` para componentes anidados.
- Refiérase al `Select` para componentes que dependen de otros componentes.


## Estilo de Desarrollo
Por favor acate a este estilo [ESLint](https://github.com/ElemeFE/eslint-config-elemefe) configuración de [ElemeFE](https://github.com/elemefe).

