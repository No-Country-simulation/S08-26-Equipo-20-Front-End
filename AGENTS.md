# ServiceFlow | Front-End

Guía de DESARROLLO y REGLAS para mantener el código, la arquitectura y el flujo de trabajo del proyecto.

## Principios

ServiceFlow debe seguir los principios de Clean Code y SOLID, priorizando siempre un código simple, claro, legible y fácil de mantener. Se debe evitar la sobreingeniería y no introducir abstracciones, patrones o estructuras innecesarias cuando una solución más sencilla resuelva correctamente el problema.

## Front-End

ServiceFlow utiliza NextJS y TypeScript, manteniendo una estructura clara donde los componentes se encargan de la interfaz y la presentación, los servicios gestionan la comunicación con el Back-End y los hooks y utilidades contienen lógica reutilizable cuando sea necesario. Se utiliza Tailwind CSS para los estilos y Lucide React para los iconos. No se debe colocar lógica de negocio compleja en los componentes ni duplicar lógica innecesariamente. Los datos recibidos y enviados al Back-End deben manejarse correctamente y los errores deben mostrarse de forma clara al usuario. No se deben exponer información sensible, credenciales, tokens, secretos o configuraciones sensibles en el código del Front-End.

## Arquitectura

Cada parte debe mantener una responsabilidad clara.

Components → Services → Back-End API

## Git

### Commits

Hacer uso de Conventional Commits:

```text
feat: nueva funcionalidad
fix: corrección
refactor: refactorización
test: pruebas
docs: documentación
chore: configuración
```

### Branches

```text
feat/nombre
fix/nombre
refactor/nombre
test/nombre
docs/nombre
chore/nombre
```

## Workflow

El trabajo debe seguir un flujo ordenado, analizar el estado actual antes de modificarlo, explicar los cambios antes de implementarlos y consultar antes de tomar decisiones que afecten al proyecto. Solo se debe implementar lo solicitado, verificar los cambios realizados e informar las acciones ejecutadas. Una vez finalizado el trabajo, se debe esperar la siguiente instrucción y no realizar cambios que estén fuera del alcance establecido.
