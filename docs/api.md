# ServiceFlow | Front-End | API

Documentación de la comunicación entre el Front-End y la API REST de ServiceFlow.

El Front-End utiliza la API del Back-End para autenticarse, consultar información, crear y gestionar solicitudes y acceder a las funcionalidades disponibles según el rol del usuario.

## Comunicación

La comunicación entre el Front-End y el Back-End se realiza mediante solicitudes HTTP.

El Front-End debe utilizar los Services para centralizar las llamadas a la API.

```text id="m3q8pz"
Component
    ↓
Service
    ↓
HTTP Request
    ↓
Back-End API
    ↓
HTTP Response
    ↓
Service
    ↓
Component
```

## Base URL

La URL base de la API debe configurarse según el entorno y no debe estar hardcodeada en los componentes.

La configuración debe utilizar variables de entorno proporcionadas por Next.js.

## Autenticación

Las operaciones que requieren autenticación deben enviar las credenciales o el token correspondiente según el endpoint.

Flujo principal:

```text id="v5n8jk"
Login
  ↓
Back-End valida credenciales
  ↓
JWT
  ↓
Front-End mantiene la sesión
  ↓
Solicitudes autenticadas
```

El Front-End no debe implementar lógica propia para validar credenciales. La autenticación y autorización son responsabilidad del Back-End.

## Endpoints

El Front-End consume principalmente los siguientes grupos de endpoints:

### Autenticación

```text id="q6b2xz"
POST /auth/login
GET  /auth/me
POST /auth/change-password
```

### Usuarios

```text id="k7d4sa"
GET    /users
POST   /users
GET    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}
```

### Equipos

```text id="r8f1nc"
GET    /teams
POST   /teams
GET    /teams/{id}
PATCH  /teams/{id}
DELETE /teams/{id}
```

### Categorías

```text id="t2v9hm"
GET    /categories
POST   /categories
PATCH  /categories/{id}
DELETE /categories/{id}
```

### Prioridades

```text id="p4j6wk"
GET    /priorities
POST   /priorities
PATCH  /priorities/{id}
DELETE /priorities/{id}
```

### Solicitudes

```text id="b3x7qa"
POST  /requests
GET   /requests
GET   /requests/{id}
PATCH /requests/{id}
```

Los endpoints disponibles pueden ampliarse a medida que se implementen nuevas funcionalidades en el Back-End.

## Services

Las llamadas HTTP deben centralizarse en Services.

Los Services son responsables de:

* Construir las solicitudes.
* Enviar los datos correspondientes.
* Procesar las respuestas.
* Manejar errores provenientes de la API.
* Mantener separada la comunicación HTTP de la interfaz.

Los Components no deben realizar directamente llamadas HTTP cuando estas puedan gestionarse mediante un Service.

## Respuestas

El Front-End debe utilizar los datos proporcionados por la API respetando los contratos definidos por el Back-End.

Las respuestas deben tiparse mediante TypeScript cuando corresponda.

Los datos no deben transformarse innecesariamente si la transformación no aporta una responsabilidad clara.

## Errores

Los errores provenientes de la API deben convertirse en mensajes comprensibles para el usuario.

No se deben mostrar errores técnicos innecesarios.

Ejemplos:

```text id="z1q5ne"
Credenciales inválidas
No se pudo cargar la información
No se pudo crear la solicitud
No tiene permisos para realizar esta acción
```

Los estados de error deben ser visibles y permitir al usuario entender qué ocurrió.

## Estados de las solicitudes

El Front-End debe representar los estados definidos por el Back-End:

```text id="s9c2ld"
NEW
IN_PROGRESS
PENDING
RESOLVED
CLOSED
```

No se deben agregar estados en la interfaz que no formen parte del contrato vigente del Back-End.

## Roles

El Front-End utiliza el rol proporcionado por el Back-End para determinar la interfaz y las funcionalidades disponibles.

Roles:

```text id="e5k8yr"
ADMIN
AGENT
USER
```

La ocultación de elementos en la interfaz no reemplaza la autorización del Back-End.

El Back-End siempre es la autoridad final sobre los permisos.

## Seguridad

* No almacenar credenciales en código fuente.
* No hardcodear URLs sensibles o configuraciones dependientes del entorno.
* No exponer secretos en el cliente.
* No registrar tokens ni credenciales en logs.
* Validar los errores de autenticación correctamente.
* Respetar los permisos proporcionados por el Back-End.
