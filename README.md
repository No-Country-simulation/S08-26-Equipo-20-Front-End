# ServiceFlow | Front-End

App Web para la gestión centralizada de solicitudes internas de una organización.

ServiceFlow permite a los usuarios crear y realizar el seguimiento de solicitudes, mientras que los agentes gestionan su atención y los administradores configuran los recursos del sistema.

## Integrantes

* Matias Bertuccio — Software Engineer
* Alexis Albarenga — Software Engineer
* Linder Rodríguez — Software Engineer
* Andrés Uzeda — QA Engineer

## Tecnologías

Front-End:

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-000000?style=flat-square&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-000000?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-000000?style=flat-square&logo=tailwindcss&logoColor=white)

Tests:

![Vitest](https://img.shields.io/badge/Vitest-000000?style=flat-square&logo=vitest&logoColor=white)

Herramientas:

![ESLint](https://img.shields.io/badge/ESLint-000000?style=flat-square&logo=eslint&logoColor=white) ![Git](https://img.shields.io/badge/Git-000000?style=flat-square&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-000000?style=flat-square&logo=github&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-000000?style=flat-square) ![OpenCode](https://img.shields.io/badge/OpenCode-000000?style=flat-square&logo=opencode&logoColor=white)

## Instalación

Requiere Node.js y npm.

```bash
npm install
```

El repositorio contiene dos archivos de bloqueo de dependencias: `package-lock.json` (npm) y `pnpm-lock.yaml` (pnpm). El árbol de dependencias utilizado en desarrollo corresponde a **npm**, por lo que se recomienda `npm install` para reproducir el entorno probado.

## Ejecución

Desarrollo:

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

Producción:

```bash
npm run build
npm start
```

## Variables de Entorno

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Si | URL base del Back-End, sin barra final. Ejemplo: `http://localhost:8000` |

El archivo `.env.example` documenta la variable. Para desarrollo local se utiliza `.env.local`, que no se versiona en el repositorio.

Al ser una variable `NEXT_PUBLIC_`, su valor se incorpora al bundle del cliente: no debe usarse para secretos.

## Tests

```bash
npm test
```

Ejecución en modo watch:

```bash
npm run test:watch
```

## Linter

```bash
npm run lint
```

Para revisar de forma explícita todo el proyecto:

```bash
npx eslint .
```

## Integración con Back-End

El Front-End se comunica con el Back-End mediante llamadas `fetch` que se originan en los Client Components. El flujo es `Component → services → services/http.ts → API del Back-End`.

* Requiere que el Back-End esté ejecutándose y accesible antes de poder usar la aplicación.
* La URL base se define exclusivamente con la variable de entorno `NEXT_PUBLIC_API_URL`, que debe apuntar a `http://localhost:8000` en desarrollo local.
* No existe proxy ni reescritura de rutas en la configuración de Next.js: el navegador contacta directamente al Back-End.
* El Back-End expone CORS de forma permisiva, por lo que no requiere configuración adicional de orígenes permitidos.
* Las rutas de la API se definen sin prefijo adicional. Si el Back-End se despliega bajo un prefijo de ruta, ese prefijo debe formar parte del valor de `NEXT_PUBLIC_API_URL`.

Para verificar la comunicación, consultar el endpoint de salud del Back-End:

```bash
curl http://localhost:8000/health
```

Si la respuesta es `{"status":"ok"}`, la API está disponible. Luego, al acceder a `http://localhost:3000` e iniciar sesión, las pantallas que consumen datos del Back-End deberían cargar correctamente. Si aparece el mensaje "No se pudo conectar con el servidor", revisar el valor de `NEXT_PUBLIC_API_URL`.

## Documentación Adicional

* `docs/structure.md` — arquitectura y estructura de carpetas
* `docs/api.md` — endpoints del Back-End consumidos por el Front-End
* `docs/auth.md` — flujo de autenticación y sesión
* `docs/testing.md` — estrategia de pruebas
* `docs/ux-ui.md` — guía de UX/UI

---

* Creación: 06/09/2026
* Última Actualización: 01/10/2026
