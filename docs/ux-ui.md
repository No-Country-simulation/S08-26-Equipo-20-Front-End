# ServiceFlow | Front-End | UX/UI

Guía visual y de experiencia de usuario para mantener una interfaz consistente, simple y accesible en ServiceFlow.

## Identidad

ServiceFlow es una plataforma corporativa para la gestión de solicitudes internas.

* Logo: `serviceflow_logo.svg`.
* Wordmark: `SERVICEFLOW`.
* Tagline de acceso: `Acceso Corporativo`.
* Idioma: español rioplatense.
* Tratamiento: usted.
* Mayúsculas: únicamente para la marca y encabezados conceptuales.

El logo debe utilizarse en la cabecera de las pantallas de acceso y en la barra superior de la aplicación.

## Principios de Diseño

ServiceFlow debe seguir los siguientes principios:

* Dark Mode por defecto. No se utiliza modo claro.
* Menos es más: una acción principal por pantalla.
* Consistencia entre componentes y pantallas.
* Feedback visible para estados de carga, éxito y error.
* Accesibilidad mediante contraste adecuado, foco visible y etiquetas descriptivas.

## Paleta de Colores

La interfaz utiliza principalmente la escala neutra `zinc` de Tailwind CSS.

| Uso               | Token                               |
| ----------------- | ----------------------------------- |
| Fondo             | `bg-zinc-950`                       |
| Superficie / Card | `bg-zinc-900`                       |
| Borde             | `border-zinc-800`                   |
| Placeholder       | `placeholder-zinc-700`              |
| Foco              | `ring-zinc-600` / `border-zinc-600` |
| Texto mutado      | `text-gray-400` / `text-zinc-500`   |
| Texto tenue       | `text-zinc-600`                     |
| Texto principal   | `text-white` / `text-zinc-100`      |
| Primario          | `bg-white text-black`               |
| Error             | `text-red-500`                      |
| Éxito             | `text-emerald-500`                  |
| Información       | `text-blue-500`                     |
| Advertencia       | `text-amber-500`                    |

## Tipografía

La interfaz utiliza:

* `Space Grotesk` para la interfaz.
* `Geist Mono` para código, IDs y valores técnicos.

Escala principal:

| Elemento  | Estilo                                                   |
| --------- | -------------------------------------------------------- |
| Título    | `text-2xl font-bold text-white tracking-tight`           |
| Marca     | `text-lg font-bold tracking-widest uppercase text-white` |
| Subtítulo | `text-xs text-gray-400`                                  |
| Cuerpo    | `text-sm text-zinc-200`                                  |
| Etiqueta  | `text-xs text-gray-400`                                  |
| Metadatos | `text-[10px] text-zinc-600 tracking-wide`                |

## Layout

* Formularios y cards: `max-w-sm`.
* Padding estándar de cards: `p-8`.
* Formularios: `space-y-4`.
* Separación entre secciones: `mb-8`.
* Pantallas de acceso: `flex items-center justify-center min-h-screen flex-col`.
* Cards e inputs: `rounded-lg`.
* Inputs y botones compactos: `py-2 px-3 text-sm`.

## Botones

### Primario

La acción principal utiliza:

```text id="i4v8e2"
bg-white text-black font-medium text-sm py-2 rounded-md
hover:bg-gray-200 transition-colors
```

Los botones deshabilitados utilizan `disabled:opacity-60`.

### Secundario

```text id="y0o7qf"
border border-zinc-800 text-zinc-300 px-4 py-2 rounded-md
hover:bg-zinc-900 hover:text-white transition-colors
```

### Iconos

Los botones que utilizan únicamente un icono deben utilizar:

```text id="2qk0rx"
text-zinc-500 hover:text-zinc-300
```

Los iconos estándar utilizan `w-4 h-4`.

Toda acción basada únicamente en un icono debe incluir un `aria-label` descriptivo.

## Inputs

Clase base:

```text id="8cq8vz"
w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-colors
```

Las etiquetas utilizan:

```text id="q0v9l8"
block text-xs text-gray-400 mb-1.5
```

Los errores utilizan:

* `border-red-500` en el campo.
* `text-xs text-red-500` para el mensaje.
* `role="alert"` para comunicar el error.

Los campos de contraseña pueden utilizar `Eye` y `EyeOff` de Lucide React.

## Cards

Las cards utilizan:

```text id="x5z1vo"
bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl
```

## Badges

Formato:

```text id="v7g1qi"
inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
```

### Roles

* `ADMIN` → `bg-white text-black`
* `AGENT` → `bg-blue-500/20 text-blue-400`
* `USER` → `bg-zinc-800 text-zinc-300`

### Estados

* `NEW` → `bg-blue-500/20 text-blue-400`
* `IN_PROGRESS` → `bg-amber-500/20 text-amber-400`
* `RESOLVED` → `bg-emerald-500/20 text-emerald-400`
* `CLOSED` → `bg-zinc-800 text-zinc-400`
* `CANCELLED` → `bg-red-500/20 text-red-400`

`CANCELLED` solo debe utilizarse si este estado forma parte del contrato vigente del Back-End.

## Tablas

Las tablas utilizan:

* Filas: `border-b border-zinc-800`.
* Encabezados: `text-xs text-gray-400`.
* Celdas: `text-sm text-zinc-200`.
* Hover: `hover:bg-zinc-900`.

## Modales

Overlay:

```text id="y2l5cu"
bg-zinc-950/80 backdrop-blur-sm
```

Panel:

```text id="z4n6hp"
bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-md
```

## Estados de la Interfaz

### Estado vacío

Debe mostrar un icono acompañado de:

```text
No hay resultados
```

Utilizar `text-sm text-zinc-500`.

### Estado de carga

Debe utilizar `Loader2` de Lucide React con `animate-spin` junto con un mensaje descriptivo.

Nunca se debe bloquear una pantalla sin indicar que existe una operación en progreso.

### Feedback

Las acciones deben comunicar claramente:

* Carga.
* Éxito.
* Error.

Los mensajes deben ser claros y accionables.

## Iconografía

Se utiliza `lucide-react`.

Los iconos estándar utilizan `w-4 h-4`.

Los botones con texto utilizan `gap-2` cuando contienen un icono.

Las acciones que solo utilizan iconos deben tener un `aria-label` descriptivo.

## Microcopy

El lenguaje debe ser cercano pero profesional y utilizar tratamiento de usted.

Los mensajes de error deben evitar tecnicismos.

Ejemplos:

```text id="n4p8ly"
Credenciales inválidas
La contraseña debe tener al menos 8 caracteres
```

Los botones deben utilizar la estructura verbo + objeto:

```text id="k5w2pf"
Iniciar Sesión
Crear Usuario
Cerrar Sesión
Guardar Cambios
```

## Accesibilidad

La interfaz debe mantener:

* Contraste mínimo de `4.5:1` para texto.
* Foco visible mediante `focus:ring`.
* `label` asociado correctamente mediante `htmlFor` e `id`.
* Campos obligatorios correctamente identificados.
* Atributos `autoComplete` adecuados.
* `aria-label` en acciones que solo utilicen iconos.

## Implementación

El Front-End utiliza:

* NextJS.
* TypeScript.
* Tailwind CSS v4.
* Lucide React.
* Space Grotesk.
* Geist Mono.

Tailwind CSS v4 no utiliza `tailwind.config.js`. Los tokens se definen mediante `@theme` en `globals.css` y se utilizan las utilidades de Tailwind directamente.

Los componentes que necesitan estado, eventos o Hooks de React deben utilizar `"use client"`.

Los componentes estáticos deben mantenerse como Server Components siempre que sea posible.
