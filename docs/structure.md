# ServiceFlow | Front-End | Estructura

Estructura del Front-End y distribución de responsabilidades dentro del proyecto.

## Arquitectura

ServiceFlow utiliza una estructura basada en componentes y servicios:

```text
Pages / Routes
  ↓
Components
  ↓
Services
  ↓
Back-End API
```

Cada parte mantiene una responsabilidad clara y evita concentrar diferentes responsabilidades en un mismo lugar.

## Pages / Routes

Las Pages y Routes representan las diferentes pantallas y rutas de la aplicación.

Responsabilidades:

* Definir las rutas disponibles.
* Componer los componentes necesarios para cada pantalla.
* Controlar el acceso a las diferentes áreas del sistema.
* Manejar la estructura general de cada página.

Las Pages no deben contener lógica de negocio compleja.

## Components

Los Components representan elementos visuales reutilizables de la interfaz.

Responsabilidades:

* Mostrar información.
* Recibir datos mediante props.
* Manejar interacciones de usuario cuando corresponda.
* Reutilizar elementos comunes de la interfaz.
* Mantener una estructura clara y fácil de mantener.

Los componentes deben evitar contener lógica de negocio compleja.

## Services

Los Services gestionan la comunicación con el Back-End.

Responsabilidades:

* Realizar solicitudes HTTP.
* Enviar datos al Back-End.
* Procesar las respuestas.
* Manejar los errores provenientes de la API.

Los Services no deben encargarse de representar directamente la interfaz.

## Hooks

Los Hooks contienen lógica reutilizable relacionada con el estado y el comportamiento de los componentes cuando sea necesario.

Se deben utilizar únicamente cuando aporten una responsabilidad clara y eviten duplicación de lógica.

No se deben crear Hooks innecesarios para operaciones simples que puedan resolverse directamente en un componente.

## Types

Los Types definen las estructuras de datos utilizadas por el Front-End.

Permiten mantener consistencia entre:

* Datos recibidos del Back-End.
* Datos enviados al Back-End.
* Props de los componentes.
* Estados utilizados por la aplicación.

Se utiliza TypeScript para garantizar el tipado estático.

## Estilos

La interfaz utiliza Tailwind CSS para los estilos.

Los estilos deben seguir los tokens y componentes definidos en la documentación de UX/UI.

No se deben introducir estilos que contradigan la guía visual del proyecto sin una decisión previa.

## Server Components y Client Components

Se deben utilizar Server Components para contenido estático y componentes que no requieran interacción del usuario.

Se debe utilizar `"use client"` únicamente cuando el componente necesite:

* Estado.
* Eventos del usuario.
* Hooks de React.
* APIs disponibles exclusivamente en el cliente.

No se debe utilizar `"use client"` innecesariamente.

## Responsabilidades

Cada parte del proyecto debe mantener una responsabilidad clara:

```text
Pages / Routes → estructura y navegación
Components    → interfaz e interacción
Services      → comunicación con la API
Hooks         → lógica reutilizable
Types         → tipado de datos
Tailwind CSS  → estilos
```

## Principios

La estructura debe mantenerse simple y clara.

Se deben aplicar Clean Code y SOLID sin introducir abstracciones o patrones innecesarios.

Cada componente debe tener una responsabilidad clara y el código debe permanecer fácil de entender, probar y mantener.
