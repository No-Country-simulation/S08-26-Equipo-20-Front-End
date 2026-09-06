# ServiceFlow | Front-End | Testing

Estrategia de pruebas utilizada para verificar el correcto funcionamiento del Front-End y mantener la estabilidad de la aplicación durante su desarrollo.

## Objetivo

Las pruebas deben verificar principalmente:

* Renderizado de componentes.
* Interacciones del usuario.
* Validación de formularios.
* Navegación.
* Manejo de estados.
* Comunicación con la API.
* Autenticación.
* Control de acceso según el rol.
* Manejo de errores.

## Componentes

Los componentes deben probarse para verificar:

* Renderizado correcto.
* Información mostrada.
* Interacciones disponibles.
* Estados de carga.
* Estados vacíos.
* Estados de error.
* Comportamiento de botones y formularios.

Las pruebas deben centrarse en el comportamiento visible para el usuario.

## Formularios

Los formularios deben verificar:

* Campos obligatorios.
* Validaciones.
* Mensajes de error.
* Envío correcto de datos.
* Estado de carga.
* Manejo de errores provenientes de la API.
* Prevención de envíos inválidos.

## Autenticación

Se deben probar como mínimo:

* Login exitoso.
* Credenciales inválidas.
* Redirección según el rol.
* Sesión autenticada.
* Sesión expirada.
* Cierre de sesión.
* Cambio obligatorio de contraseña.
* Acceso no autorizado.

## Navegación y roles

Se debe verificar que cada rol acceda al área correspondiente:

```text
USER   → /user
AGENT  → /agent
ADMIN  → /admin
```

También se debe verificar que un usuario no pueda acceder desde el Front-End a áreas que no corresponden a su rol.

La protección del Front-End no reemplaza la autorización del Back-End.

## Comunicación con la API

Las llamadas realizadas mediante Services deben verificarse considerando:

* Solicitudes exitosas.
* Datos enviados correctamente.
* Respuestas procesadas correctamente.
* Errores HTTP.
* Sesiones inválidas.
* Estados de carga.
* Estados de error.

Las pruebas no deben depender de un Back-End real cuando pueda utilizarse una respuesta controlada.

## Estados de interfaz

Los componentes que realizan operaciones asíncronas deben contemplar:

```text
Loading
Success
Error
Empty
```

Cada estado debe proporcionar feedback adecuado al usuario.

## Accesibilidad

Cuando corresponda, las pruebas deben verificar:

* Labels correctamente asociados.
* Elementos interactivos accesibles.
* `aria-label` en acciones basadas únicamente en iconos.
* Estados de error comunicados correctamente.
* Navegación mediante teclado.

## Herramientas

Las herramientas de testing se definirán de acuerdo con las necesidades reales del proyecto.

No se deben introducir librerías o herramientas de testing innecesarias.

## Buenas prácticas

* Cada prueba debe verificar un comportamiento concreto.
* Las pruebas deben ser claras y fáciles de mantener.
* No se deben realizar pruebas innecesariamente complejas.
* Las pruebas no deben depender entre sí.
* Los cambios relevantes en el comportamiento deben acompañarse de las pruebas correspondientes.
* Se debe priorizar probar comportamiento sobre detalles internos de implementación.
