# ServiceFlow | Front-End | Autenticación

Gestión de autenticación, sesión y acceso a las diferentes áreas de ServiceFlow desde el Front-End.

La autenticación es responsabilidad del Back-End. El Front-End utiliza la información proporcionada por la API para mantener la sesión y controlar la navegación de la aplicación.

## Login

El usuario inicia sesión utilizando:

* Email.
* Contraseña.

El Front-End envía las credenciales al endpoint:

```text
POST /auth/login
```

Si las credenciales son válidas, el Back-End devuelve un JWT y la información necesaria para determinar el estado de la cuenta.

El usuario no debe seleccionar su rol durante el login. El rol es determinado por el Back-End.

## Sesión

Una vez autenticado, el Front-End utiliza el JWT para realizar las solicitudes que requieren autenticación.

Las solicitudes protegidas deben incluir el token correspondiente.

El Front-End debe manejar correctamente:

* Inicio de sesión.
* Sesión autenticada.
* Cierre de sesión.
* Token inválido.
* Token expirado.
* Usuario no autorizado.

La sesión debe finalizar cuando el usuario cierre sesión o cuando el token deje de ser válido.

## JWT

El JWT es generado y firmado por el Back-End.

El Front-End no debe generar, modificar ni validar manualmente las credenciales del usuario.

El token debe tratarse como información sensible.

No debe:

* Exponerse en la interfaz.
* Registrarse en logs.
* Incluirse en código fuente.
* Compartirse innecesariamente con otros servicios.

## Usuario autenticado

El Front-End puede obtener la información del usuario autenticado mediante:

```text
GET /auth/me
```

Esta información permite conocer:

* Identidad del usuario.
* Rol.
* Equipo.
* Estado de la cuenta.

El Back-End continúa siendo la autoridad sobre la identidad y los permisos del usuario.

## Roles

ServiceFlow cuenta con tres roles:

```text
ADMIN
AGENT
USER
```

Después de iniciar sesión, el usuario debe ser dirigido al área correspondiente:

```text
USER   → /user
AGENT  → /agent
ADMIN  → /admin
```

El usuario no debe poder seleccionar manualmente el área a la que pertenece.

## Protección de rutas

Las rutas protegidas deben verificar que exista una sesión válida antes de mostrar su contenido.

La protección del Front-End tiene como objetivo controlar la navegación y la experiencia del usuario.

No reemplaza la autorización del Back-End.

Un usuario que intente acceder a una funcionalidad sin permisos debe ser rechazado por la API aunque la ruta sea accesible desde el navegador.

## Cambio obligatorio de contraseña

El Back-End puede indicar que el usuario debe cambiar su contraseña mediante:

```text
must_change_password
```

Cuando este valor sea verdadero, el Front-End debe dirigir al usuario al flujo de cambio de contraseña.

El usuario debe completar el cambio antes de continuar utilizando el sistema normalmente.

El cambio se realiza mediante:

```text
POST /auth/change-password
```

Después de un cambio exitoso, el Back-End devuelve un nuevo token.

El Front-End debe utilizar el nuevo token para continuar la sesión.

## Cierre de sesión

El cierre de sesión debe:

* Eliminar la información de sesión almacenada en el cliente.
* Evitar nuevas solicitudes autenticadas.
* Redirigir al usuario a `/login`.

La interfaz debe proporcionar una acción clara:

```text
Cerrar Sesión
```

## Errores de autenticación

Los errores deben mostrarse mediante mensajes claros y sin información sensible.

Ejemplos:

```text
Credenciales inválidas
La sesión expiró
No tiene permisos para realizar esta acción
```

No se debe informar si un email existe o si una cuenta se encuentra inactiva cuando el Back-End devuelve un error genérico de autenticación.

## Seguridad

* No almacenar secretos en el código del Front-End.
* No registrar JWT, contraseñas ni credenciales.
* No implementar lógica propia de autenticación.
* No confiar únicamente en la protección de rutas del Front-End.
* Utilizar siempre la respuesta del Back-End como fuente de verdad sobre identidad, sesión y permisos.
