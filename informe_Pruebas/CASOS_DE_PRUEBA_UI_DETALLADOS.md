# Especificación Detallada de Casos de Prueba de UI (Test Cases)
**Estándar de Calidad y Verificación de Experiencia de Usuario**
**Proyecto:** ServiceFlow (No Country — S08-26-Equipo-20)
**Autor:** Andres Adrian Estrada
**Capa:** UI (Pruebas de Interfaz de Usuario / Manuales y E2E)
**Total de Casos de Prueba:** 46
**Entorno de Pruebas:**
- **Front-End:** Next.js 16 + React 19 + Tailwind CSS (`http://localhost:3000`)
- **Back-End API:** FastAPI + PostgreSQL + SQLAlchemy (`http://localhost:8000`)

---

## Índice General de Casos de Prueba

| N° | ID | Módulo | Caso de prueba | Prioridad |
| :---: | :--- | :--- | :--- | :---: |
| 1 | `TC-AUTH-01` | 1. Autenticación y Sistema | Login exitoso con credenciales válidas y redirección por rol | Alta |
| 2 | `TC-AUTH-02` | 1. Autenticación y Sistema | Login fallido con contraseña incorrecta | Alta |
| 3 | `TC-AUTH-03` | 1. Autenticación y Sistema | Login fallido con usuario inexistente / formato inválido | Media |
| 4 | `TC-AUTH-08` | 1. Autenticación y Sistema | Cierre de sesión invalida sesión y protege rutas privadas | Media |
| 5 | `TC-CUST-01` | 2. Customer: Solicitudes | Crear solicitud con descripción detallada en modal | Alta |
| 6 | `TC-CUST-02` | 2. Customer: Solicitudes | Crear solicitud con descripción corta (< 10 caracteres) → error | Alta |
| 7 | `TC-CUST-03` | 2. Customer: Solicitudes | "Mis solicitudes" muestra exclusivamente los tickets propios | Alta |
| 8 | `TC-CUST-04` | 2. Customer: Solicitudes | Ver detalle de una solicitud propia (#REQ-ID, estado, metadatos) | Alta |
| 9 | `TC-CUST-06` | 2. Customer: Solicitudes | Estado se refleja correctamente tras cambios del agente | Alta |
| 10 | `TC-CUST-07` | 2. Customer: Solicitudes | Consultar prioridad asignada en vista de detalle | Media |
| 11 | `TC-CUST-08` | 2. Customer: Solicitudes | Consultar equipo y agente responsable asignado | Media |
| 12 | `TC-CUST-09` | 2. Customer: Solicitudes | Agregar comentario a solicitud propia mediante "Enviar Respuesta" | Media |
| 13 | `TC-CUST-11` | 2. Customer: Solicitudes | Adjuntar archivo válido desde el modal de nueva solicitud | Media |
| 14 | `TC-CUST-12` | 2. Customer: Solicitudes | Adjuntar archivo con formato no permitido → error de carga | Media |
| 15 | `TC-CUST-13` | 2. Customer: Solicitudes | Adjuntar archivo que excede tamaño máximo permitido → error | Media |
| 16 | `TC-AGENT-01` | 3. Service Agent | Consultar listado completo de solicitudes con filtro de prioridad | Alta |
| 17 | `TC-AGENT-02` | 3. Service Agent | Ver detalle completo de solicitud con sidebar interactiva | Alta |
| 18 | `TC-AGENT-03` | 3. Service Agent | Categorizar solicitud sin categoría asignada | Alta |
| 19 | `TC-AGENT-04` | 3. Service Agent | Cambiar categoría de solicitud y verificar registro en historial | Media |
| 20 | `TC-AGENT-05` | 3. Service Agent | Establecer prioridad desde el selector de propiedades | Alta |
| 21 | `TC-AGENT-06` | 3. Service Agent | Asignar equipo a la solicitud | Alta |
| 22 | `TC-AGENT-07` | 3. Service Agent | Asignar responsable filtrado por miembros del equipo | Alta |
| 23 | `TC-AGENT-08` | 3. Service Agent | Cambiar estado en flujo de atención (Nuevo → En Progreso → Resuelto) | Alta |
| 24 | `TC-AGENT-11` | 3. Service Agent | Agregar comentario público visible para el Customer | Media |
| 25 | `TC-AGENT-13` | 3. Service Agent | Consultar historial completo de cambios y auditoría | Media |
| 26 | `TC-SLA-02` | 4. SLA | Consultar SLA muestra vencimiento de respuesta y resolución | Alta |
| 27 | `TC-SLA-03` | 4. SLA | Detecta solicitud con vencimiento próximo o en plazo | Alta |
| 28 | `TC-SLA-04` | 4. SLA | Marca solicitud con indicador y badge "Vencido" cuando expira | Alta |
| 29 | `TC-APR-03` | 5. Aprobaciones | Solicitud en categoría con aprobación genera registro "Pendiente" | Media |
| 30 | `TC-APR-04` | 5. Aprobaciones | Aprobación exitosa por administrador actualiza registro a "Aprobado" | Alta |
| 31 | `TC-APR-05` | 5. Aprobaciones | Rechazo de aprobación muestra estado "Rechazado" y comentario | Alta |
| 32 | `TC-APR-06` | 5. Aprobaciones | Consultar estado de aprobación en sidebar de la solicitud | Media |
| 33 | `TC-ADM-01` | 6. Service Admin | Crear usuario nuevo con rol (Admin/Agent/User) y clave temporal | Alta |
| 34 | `TC-ADM-02` | 6. Service Admin | Consultar tabla de usuarios con buscador y filtro por rol | Media |
| 35 | `TC-ADM-03` | 6. Service Admin | Editar datos de usuario (nombre, equipo, estado activo) | Media |
| 36 | `TC-ADM-04` | 6. Service Admin | Asignar / cambiar rol de usuario y validar permisos del portal | Alta |
| 37 | `TC-ADM-05` | 6. Service Admin | Crear equipo de soporte con nombre y descripción | Media |
| 38 | `TC-ADM-06` | 6. Service Admin | Editar equipo y gestionar miembros (agregar/quitar) | Media |
| 39 | `TC-ADM-07` | 6. Service Admin | Crear categoría con checkbox "Requiere aprobación" marcado | Alta |
| 40 | `TC-ADM-08` | 6. Service Admin | Crear categoría sin requerimiento de aprobación | Alta |
| 41 | `TC-ADM-09` | 6. Service Admin | Editar nombre o requerimiento de aprobación en categoría existente | Media |
| 42 | `TC-ADM-10` | 6. Service Admin | Crear prioridad con nombre y nivel numérico (1 a 10) | Media |
| 43 | `TC-ADM-11` | 6. Service Admin | Editar nombre o nivel de prioridad existente | Baja |
| 44 | `SM-01` | 9. Smoke (pre-build) | Login exitoso con cada rol (Customer → /user, Agent → /agent, Admin → /admin) | Alta |
| 45 | `SM-02` | 9. Smoke (pre-build) | Crear solicitud básica desde el modal de usuario | Alta |
| 46 | `SM-03` | 9. Smoke (pre-build) | Ver detalle de solicitud con navegación fluida | Alta |

---

# Módulo 1. Autenticación y Sistema

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AUTH-01`
- **Módulo / Funcionalidad:** 1. Autenticación y Sistema / Inicio de Sesión
- **Título:** Login exitoso con credenciales válidas y redirección por rol
- **Tipo de Prueba:** Funcional / Positiva / Seguridad
- **Etiquetas:** `@Smoke` `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. La aplicación Front-End está en ejecución en `http://localhost:3000` y la API en `http://localhost:8000`.
2. Usuario registrado con rol Customer/User en estado activo (`is_active: true`).
3. Sin sesión previa activa en el navegador.

---

### Datos de Prueba (Test Data)
- **Customer / User:** `user@serviceflow.com` / `user123`
- **Ruta de destino:** `/user`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Navegar a la pantalla de acceso | URL `http://localhost:3000/login` | Pantalla de Login (`/login`) |
| **2** | Ingresar correo electrónico en el campo Email | `user@serviceflow.com` | `input#email` (placeholder: `usuario@empresa.com`) |
| **3** | Ingresar contraseña en el campo Contraseña | `user123` | `input#password` (placeholder: `••••••••`) |
| **4** | Presionar el botón de inicio de sesión | Clic | `button[type='submit']` con texto `Iniciar Sesión` |
| **5** | Verificar redirección y carga del portal | N/A | Cabecera con Brand `Portal de Solicitudes`, nombre de usuario y botón `Cerrar Sesión` en `/user` |

---

### Resultado Esperado
1. El sistema valida las credenciales, almacena el token JWT de acceso y redirige al usuario a su área asignada (`/user`).
2. Se visualiza el nombre del usuario y el botón `Cerrar Sesión` en el header.
3. No se presenta ningún mensaje de alerta ni error.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AUTH-02`
- **Módulo / Funcionalidad:** 1. Autenticación y Sistema / Inicio de Sesión
- **Título:** Login fallido con contraseña incorrecta
- **Tipo de Prueba:** Funcional / Negativa / Seguridad
- **Etiquetas:** `@Regression` `@negative`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. La aplicación Front-End está en ejecución en `http://localhost:3000`.
2. Existe el usuario `user@serviceflow.com` registrado.

---

### Datos de Prueba (Test Data)
- **Email:** `user@serviceflow.com`
- **Contraseña inválida:** `ClaveErronea2026!`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Navegar a `/login` | URL `http://localhost:3000/login` | Pantalla de Login |
| **2** | Ingresar email válido y contraseña incorrecta | Datos de prueba | `input#email` y `input#password` |
| **3** | Hacer clic en el botón de acceso | Clic | `button[type='submit']` (`Iniciar Sesión`) |
| **4** | Inspeccionar el mensaje de alerta mostrado | N/A | Caja de alerta `<p role='alert' class='text-xs text-red-500'>` |

---

### Resultado Esperado
1. El sistema rechaza la autenticación y permanece en `/login`.
2. Se muestra el mensaje de error de credenciales inválidas sin revelar datos confidenciales.
3. No se genera sesión ni token de acceso.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AUTH-03`
- **Módulo / Funcionalidad:** 1. Autenticación y Sistema / Inicio de Sesión
- **Título:** Login fallido con usuario inexistente / formato inválido
- **Tipo de Prueba:** Funcional / Negativa / Validación
- **Etiquetas:** `@Regression` `@negative`
- **Prioridad:** Media (P2)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. La aplicación Front-End está en ejecución en `http://localhost:3000`.
2. El correo ingresado no existe en la base de datos.

---

### Datos de Prueba (Test Data)
- **Email inexistente:** `noexiste@serviceflow.com` / `clave1234`
- **Email mal formado:** `usuarioinvalido`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Navegar a `/login` | URL `http://localhost:3000/login` | Pantalla de Login |
| **2** | Probar email mal formado y presionar Iniciar Sesión | `usuarioinvalido` | `input#email` y botón `Iniciar Sesión` |
| **3** | Verificar validación del cliente | N/A | Mensaje en `role='alert'`: `Ingresá un email válido` |
| **4** | Ingresar email inexistente bien formado y contraseña | `noexiste@serviceflow.com` / `clave1234` | `input#email` e `input#password` |
| **5** | Hacer clic en `Iniciar Sesión` | Clic | `button[type='submit']` |

---

### Resultado Esperado
1. Si el formato es incorrecto, el cliente previene el envío y exige un formato válido (`Ingresá un email válido`).
2. Si el usuario no existe, la API rechaza el acceso con error genérico evitando enumeración de usuarios.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AUTH-08`
- **Módulo / Funcionalidad:** 1. Autenticación y Sistema / Gestión de Sesión
- **Título:** Cierre de sesión invalida sesión y protege rutas privadas
- **Tipo de Prueba:** Funcional / Seguridad / Sesión
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Usuario con sesión activa en el portal (`/user`, `/agent/requests` o `/admin/users`).

---

### Datos de Prueba (Test Data)
- **Usuario activo:** `user@serviceflow.com` / `user123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Iniciar sesión y situarse en el portal | Credenciales válidas | Cabecera principal (`header`) |
| **2** | Hacer clic en el botón Cerrar Sesión | Clic | Botón `Cerrar Sesión` (con icono `LogOut`) |
| **3** | Verificar la redirección inmediata | N/A | Pantalla de Login (`/login`) |
| **4** | Intentar volver usando el botón Atrás del navegador o ingresando `/user` en la barra de direcciones | Navegación directa | Barra de direcciones del navegador |
| **5** | Verificar la protección de ruta privada | N/A | Redirección forzosa a `/login` mediante `ProtectedArea` |

---

### Resultado Esperado
1. El token de sesión se destruye completamente (`clearAccessToken()`).
2. El usuario es redirigido a `/login`.
3. Ninguna ruta privada es accesible sin volver a ingresar credenciales.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

# Módulo 2. Customer: Solicitudes

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-01`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Creación de Solicitudes
- **Título:** Crear solicitud con descripción detallada en modal
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer con sesión iniciada en `http://localhost:3000/user`.

---

### Datos de Prueba (Test Data)
- **Descripción:** `Fallo recurrente al intentar emitir la factura electrónica desde el módulo de ventas.`
- **Longitud:** > 10 caracteres requeridos

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/user`, hacer clic en el botón de nueva solicitud | Clic | Botón `Crear Solicitud` (icono `Plus`) |
| **2** | Verificar la apertura del modal `Nueva Solicitud` | N/A | Modal con título `Nueva Solicitud` y subtítulo explicativo |
| **3** | Ingresar la descripción detallada en el campo | Datos de prueba | Campo `textarea#description` (`Descripción del requerimiento`) |
| **4** | Hacer clic en el botón de confirmación del modal | Clic | Botón `Crear Solicitud` del modal |
| **5** | Verificar el cierre del modal y la actualización de la lista | N/A | Tabla/lista de solicitudes en `/user` |

---

### Resultado Esperado
1. La solicitud se crea con estado `NEW` ('Nuevas').
2. Se asigna un identificador correlativo (`#REQ-{id}`).
3. Aparece de inmediato en la lista del portal y se incrementa el contador de métricas 'Activas'.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-02`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Creación de Solicitudes
- **Título:** Crear solicitud con descripción corta (< 10 caracteres) → error de validación
- **Tipo de Prueba:** Funcional / Negativa / Validación
- **Etiquetas:** `@Regression` `@negative`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer con sesión iniciada en `/user`.
2. Modal de `Nueva Solicitud` abierto.

---

### Datos de Prueba (Test Data)
- **Descripción inválida:** `Falla` (5 caracteres)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Abrir el modal de nueva solicitud | Clic en `Crear Solicitud` | Modal `Nueva Solicitud` |
| **2** | Ingresar una descripción con menos de 10 caracteres | `Falla` | `textarea#description` |
| **3** | Intentar enviar el formulario | Clic | Botón `Crear Solicitud` |
| **4** | Inspeccionar el mensaje de validación mostrado | N/A | Caja de alerta en modal: `Por favor, ingrese una descripción detallada (mínimo 10 caracteres).` |

---

### Resultado Esperado
1. El formulario bloquea la petición y no se envía ninguna solicitud al Back-End.
2. Se muestra claramente la advertencia de longitud mínima.
3. El texto ingresado se mantiene en el campo sin borrarse.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-03`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Consulta de Solicitudes
- **Título:** 'Mis solicitudes' muestra exclusivamente los tickets propios
- **Tipo de Prueba:** Funcional / Seguridad / Privacidad
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Existen tickets de diferentes clientes en la base de datos.
2. Customer A (`user@serviceflow.com`) tiene tickets propios.

---

### Datos de Prueba (Test Data)
- **Customer A:** `user@serviceflow.com` / `user123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Iniciar sesión como Customer A | Credenciales válidas | Pantalla de Login |
| **2** | Observar la lista de solicitudes en `/user` | N/A | Contenedor de lista (`RequestList`) |
| **3** | Verificar las descripciones e identificadores mostrados | N/A | Filas de tickets |
| **4** | Contrastar con solicitudes pertenecientes a otros usuarios | N/A | Validación cruzada |

---

### Resultado Esperado
1. El servicio `RequestService.getMyRequests()` consulta únicamente las solicitudes asociadas al token del usuario autenticado.
2. No se filtra ni expone información de solicitudes de terceros.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-04`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Consulta de Solicitudes
- **Título:** Ver detalle de una solicitud propia (#REQ-ID, estado, metadatos)
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer con al menos una solicitud registrada en su historial.

---

### Datos de Prueba (Test Data)
- **Solicitud existente:** `#REQ-{id}` en `/user`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En el portal `/user`, hacer clic sobre la tarjeta de la solicitud | Clic en la fila | Fila del ticket en `RequestList` |
| **2** | Verificar la navegación al detalle | Ruta `/user/requests/{id}` | Página de detalle del ticket |
| **3** | Revisar la cabecera del detalle | N/A | Botón `Volver a mis solicitudes`, código `#REQ-{id}` y badge de estado |
| **4** | Revisar el contenido principal | N/A | Encabezado `h1` con la descripción del problema |
| **5** | Revisar las tarjetas de metadatos | N/A | Tarjetas `PRIORIDAD`, `EQUIPO` y `RESPONSABLE` |

---

### Resultado Esperado
1. La pantalla `/user/requests/{id}` carga de forma íntegra los datos de la solicitud.
2. Se visualizan correctamente el código, estado, metadatos y el bloque de 'Actividad y Respuestas'.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-06`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Seguimiento de Solicitudes
- **Título:** Estado se refleja correctamente tras cambios del agente
- **Tipo de Prueba:** Funcional / Integración / Flujo
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud en estado inicial `NEW`.
2. Agente disponible para realizar cambios de estado.

---

### Datos de Prueba (Test Data)
- **Customer:** `user@serviceflow.com` / `user123`
- **Agent:** `linder@serviceflow.com` / `agent123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Como Agente en `/agent/requests/{id}`, cambiar el estado a `IN_PROGRESS` ('En Progreso') | Selector `Estado` | `select#status` |
| **2** | Como Customer, abrir o recargar `/user/requests/{id}` | Navegación / Recarga | Vista de detalle |
| **3** | Verificar el badge de estado | N/A | Badge con texto `En Proceso` |
| **4** | Como Agente, cambiar el estado a `RESOLVED` ('Resuelto') | Selector `Estado` | `select#status` |
| **5** | Como Customer, verificar nuevamente la vista de detalle | Recarga | Badge con texto `Resuelto` |

---

### Resultado Esperado
1. Los cambios de estado ejecutados por el agente se reflejan de inmediato en la interfaz del cliente.
2. La consistencia visual del `StatusBadge` se mantiene en todo el ciclo de vida.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-07`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Seguimiento de Solicitudes
- **Título:** Consultar prioridad asignada en vista de detalle
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con prioridad previamente asignada por un Agente (ej. Alta/Media/Baja).

---

### Datos de Prueba (Test Data)
- **Customer:** `user@serviceflow.com` / `user123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Acceder a `/user/requests/{id}` | Clic en la solicitud | Vista de detalle |
| **2** | Ubicar la tarjeta de metadato con icono `AlertCircle` y etiqueta `PRIORIDAD` | N/A | Tarjeta de Prioridad en la grilla superior |
| **3** | Verificar el texto de la prioridad | N/A | Texto de prioridad (ej. `Alta` o `Sin asignar`) |

---

### Resultado Esperado
1. La prioridad visible en el portal del usuario coincide exactamente con la catalogada por el agente técnico.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-08`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Seguimiento de Solicitudes
- **Título:** Consultar equipo y agente responsable asignado
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con equipo y/o agente asignado.

---

### Datos de Prueba (Test Data)
- **Customer:** `user@serviceflow.com` / `user123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Acceder a `/user/requests/{id}` | Navegación | Vista de detalle |
| **2** | Ubicar la tarjeta con icono `Users` y etiqueta `EQUIPO` | N/A | Muestra el equipo (ej. `Soporte Nivel 1` o `Sin asignar`) |
| **3** | Ubicar la tarjeta con icono `UserCheck` y etiqueta `RESPONSABLE` | N/A | Muestra el nombre del agente o `No asignado` |

---

### Resultado Esperado
1. El cliente puede consultar de forma transparente qué equipo y especialista están a cargo de la resolución de su ticket.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-09`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Comentarios
- **Título:** Agregar comentario a solicitud propia mediante 'Enviar Respuesta'
- **Tipo de Prueba:** Funcional / Positiva / Comunicación
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer situado en el detalle de una solicitud propia (`/user/requests/{id}`).

---

### Datos de Prueba (Test Data)
- **Texto de respuesta:** `He probado reiniciar el equipo pero el inconveniente continúa.`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Desplazarse a la sección `Actividad y Respuestas` | N/A | Contenedor de comentarios en `/user/requests/{id}` |
| **2** | Ingresar el mensaje en el campo de texto | Datos de prueba | `textarea` (placeholder: `Escribe una respuesta o consulta adicional...`) |
| **3** | Hacer clic en el botón de envío | Clic | Botón `Enviar Respuesta` (icono `Send`) |
| **4** | Verificar la publicación del comentario | N/A | Tarjeta de respuesta con autor, correo y fecha formateada |

---

### Resultado Esperado
1. El comentario se envía mediante `RequestService.addComment` y se agrega a la lista de actividad.
2. El área de texto se limpia automáticamente tras el envío exitoso.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-11`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Adjuntos
- **Título:** Adjuntar archivo válido desde el modal de nueva solicitud
- **Tipo de Prueba:** Funcional / Positiva / Adjuntos
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Media
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer en `/user` con modal de `Nueva Solicitud` abierto.
2. Archivo de imagen válido preparado (ej. `evidencia_error.png`, < 5MB).

---

### Datos de Prueba (Test Data)
- **Archivo:** `evidencia_error.png`
- **Control:** `input#file-upload`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En el modal `Nueva Solicitud`, hacer clic en `Seleccionar archivo` | Clic | Control `input#file-upload` (etiqueta `Adjunto (opcional)`) |
| **2** | Seleccionar el archivo `evidencia_error.png` | Archivo local | Explorador de archivos |
| **3** | Verificar que se muestre el nombre del archivo y el botón `Quitar` | N/A | Etiqueta con nombre de archivo |
| **4** | Completar la descripción (> 10 caracteres) y presionar `Crear Solicitud` | Clic | Botón `Crear Solicitud` |
| **5** | Abrir el detalle de la solicitud creada y comprobar la sección `Archivos Adjuntos (1)` | N/A | Botón con icono `Paperclip` para visor modal (`Lightbox`) |

---

### Resultado Esperado
1. El archivo se sube exitosamente vía multipart y queda vinculado a la solicitud.
2. En la vista de detalle se puede previsualizar en el visor de imagen integrado.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-12`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Adjuntos
- **Título:** Adjuntar archivo con formato no permitido → error de carga
- **Tipo de Prueba:** Funcional / Negativa / Seguridad
- **Etiquetas:** `@Regression` `@negative`
- **Prioridad:** Media (P2)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer en modal de `Nueva Solicitud`.
2. Archivo de prueba con extensión no permitida (ej. `script.exe` o `malware.bat`).

---

### Datos de Prueba (Test Data)
- **Archivo:** `script_instalador.exe`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Seleccionar el archivo no permitido en `input#file-upload` | `script_instalador.exe` | Control de archivo |
| **2** | Ingresar descripción válida y hacer clic en `Crear Solicitud` | Clic | Botón `Crear Solicitud` |
| **3** | Inspeccionar la respuesta y mensaje de error en el modal | N/A | Alerta de error en modal |

---

### Resultado Esperado
1. El sistema rechaza la carga del archivo ejecutable por políticas de seguridad.
2. Se informa al usuario sobre los formatos permitidos y no se almacena el archivo.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-CUST-13`
- **Módulo / Funcionalidad:** 2. Customer: Solicitudes / Adjuntos
- **Título:** Adjuntar archivo que excede tamaño máximo permitido → error
- **Tipo de Prueba:** Funcional / Negativa / Validación
- **Etiquetas:** `@Regression` `@negative`
- **Prioridad:** Media (P2)
- **Severidad:** Media
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer en modal de `Nueva Solicitud`.
2. Archivo que excede el tamaño máximo permitido por el sistema (ej. > 10MB).

---

### Datos de Prueba (Test Data)
- **Archivo:** `video_pesado.mp4` (> 10MB)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Seleccionar el archivo de gran tamaño en `input#file-upload` | `video_pesado.mp4` | Control de archivo |
| **2** | Intentar registrar la solicitud haciendo clic en `Crear Solicitud` | Clic | Botón `Crear Solicitud` |
| **3** | Verificar el mensaje de validación o rechazo | N/A | Alerta de error en modal |

---

### Resultado Esperado
1. La subida se cancela y se notifica al usuario que el archivo sobrepasa el límite de peso permitido.
2. La aplicación permanece estable y operativa.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

# Módulo 3. Service Agent

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-01`
- **Módulo / Funcionalidad:** 3. Service Agent / Gestión de Solicitudes
- **Título:** Consultar listado completo de solicitudes con filtro de prioridad
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Smoke` `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Sesión iniciada con rol Agent (`linder@serviceflow.com` / `agent123`).
2. Ruta `/agent/requests` accesible.

---

### Datos de Prueba (Test Data)
- **Agente:** `linder@serviceflow.com`
- **Filtro de prioridad:** `select#priority-filter`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Iniciar sesión como Agente | Credenciales válidas | Redirección a `/agent/requests` |
| **2** | Verificar la cabecera `Gestión de Solicitudes` | N/A | Subtítulo: `Visualiza, categoriza y resuelve las solicitudes de los usuarios` |
| **3** | Revisar la tabla de solicitudes | N/A | Columnas: `ID`, `Descripción`, `Estado`, `Prioridad`, `Categoría`, `Asignado`, `Fecha` |
| **4** | Interactuar con el selector de filtro por prioridad | Elegir una prioridad | Selector `select#priority-filter` (`Filtrar:`) |
| **5** | Verificar que la tabla se actualice dinámicamente | N/A | Filas filtradas por la prioridad seleccionada |

---

### Resultado Esperado
1. El agente tiene visibilidad global de todas las solicitudes emitidas en el sistema.
2. El filtro de prioridad actualiza los resultados en tiempo real sin recargar la página.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-02`
- **Módulo / Funcionalidad:** 3. Service Agent / Gestión de Solicitudes
- **Título:** Ver detalle completo de solicitud con sidebar interactiva
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Agente en `/agent/requests` con solicitudes en la lista.

---

### Datos de Prueba (Test Data)
- **Enlace de solicitud:** `#{id}`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En la tabla de solicitudes, hacer clic sobre el enlace `#{id}` | Clic | Enlace azul `#101` |
| **2** | Verificar la cabecera del detalle | Ruta `/agent/requests/{id}` | Botón con `aria-label='Volver a solicitudes'`, título `Solicitud #{id}` y autor |
| **3** | Verificar la tarjeta de Descripción | N/A | Contenedor de texto de la descripción |
| **4** | Verificar el componente de Comentarios y Notas | N/A | `RequestComments` con soporte de Nota Interna |
| **5** | Verificar la sidebar interactiva | N/A | Tarjetas `Propiedades`, `SLA (Tiempos)` y `Aprobaciones` |

---

### Resultado Esperado
1. Carga exhaustiva de la solicitud con todas las herramientas de gestión técnica para el agente.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-03`
- **Módulo / Funcionalidad:** 3. Service Agent / Categorización
- **Título:** Categorizar solicitud sin categoría asignada
- **Tipo de Prueba:** Funcional / Positiva / Clasificación
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud sin categoría asignada previamente.
2. Existen categorías activas en el sistema.

---

### Datos de Prueba (Test Data)
- **Agente:** `linder@serviceflow.com`
- **Selector:** `select#category_id`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/agent/requests/{id}`, ubicar la tarjeta `Propiedades` en la sidebar | N/A | Tarjeta `Propiedades` |
| **2** | Verificar que el selector `select#category_id` muestre `Seleccionar categoría...` | N/A | Opción por defecto sin asignar |
| **3** | Seleccionar una categoría del menú desplegable | Ej. `Infraestructura` | `select#category_id` |
| **4** | Verificar la persistencia automática vía API (`onChange`) | N/A | Spinner de actualización en cabecera de Propiedades |
| **5** | Revisar la tarjeta `Historial de Cambios` | N/A | Entrada: `Cambió Categoría a 'Infraestructura'` |

---

### Resultado Esperado
1. La categoría se guarda automáticamente sin requerir botón manual.
2. La opción vacía se elimina impidiendo desclasificar la solicitud.
3. El cambio queda registrado con autor y fecha en el historial.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-04`
- **Módulo / Funcionalidad:** 3. Service Agent / Categorización
- **Título:** Cambiar categoría de solicitud y verificar registro en historial
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con categoría ya asignada.

---

### Datos de Prueba (Test Data)
- **Nueva categoría:** Selección diferente a la actual

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/agent/requests/{id}`, ubicar el selector `select#category_id` | N/A | Selector `Categoría` |
| **2** | Cambiar la categoría actual por una nueva | Selección de nueva opción | `select#category_id` |
| **3** | Verificar que la selección se mantenga y la vista se actualice | N/A | Valor seleccionado en el control |
| **4** | Inspeccionar el componente `Historial de Cambios` | N/A | Registro actualizado en el timeline |

---

### Resultado Esperado
1. La categoría se actualiza y se refleja en el estado del ticket y en la auditoría de cambios.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-05`
- **Módulo / Funcionalidad:** 3. Service Agent / Priorización
- **Título:** Establecer prioridad desde el selector de propiedades
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud abierta en `/agent/requests/{id}`.
2. Prioridades activas configuradas (ej. Alta, Media, Baja).

---

### Datos de Prueba (Test Data)
- **Selector:** `select#priority_id` (etiqueta `Prioridad`)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Ubicar el selector `select#priority_id` en la tarjeta `Propiedades` | N/A | Campo `Prioridad` |
| **2** | Seleccionar la prioridad `Alta` | `Alta` | `select#priority_id` |
| **3** | Verificar el guardado automático inmediato | N/A | Petición a `/requests/{id}/classify` |
| **4** | Revisar la tarjeta `Historial de Cambios` | N/A | Entrada: `Cambió Prioridad a 'Alta'` |

---

### Resultado Esperado
1. La prioridad se actualiza de inmediato y se recalculan los plazos de vencimiento en el bloque de SLA.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-06`
- **Módulo / Funcionalidad:** 3. Service Agent / Asignación
- **Título:** Asignar equipo a la solicitud
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Existen equipos de soporte registrados en el sistema.

---

### Datos de Prueba (Test Data)
- **Selector:** `select#team_id` (etiqueta `Equipo Asignado`)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `Propiedades`, ubicar el selector `select#team_id` | N/A | Campo `Equipo Asignado` |
| **2** | Seleccionar un equipo de soporte (ej. `Soporte Nivel 1`) | `Soporte Nivel 1` | `select#team_id` |
| **3** | Verificar el guardado automático | N/A | Persistencia en API |
| **4** | Revisar el historial de cambios | N/A | Entrada: `Cambió Equipo asignado a 'Soporte Nivel 1'` |

---

### Resultado Esperado
1. El equipo técnico queda asignado y visible tanto para el agente como para el customer.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-07`
- **Módulo / Funcionalidad:** 3. Service Agent / Asignación
- **Título:** Asignar responsable filtrado por miembros del equipo
- **Tipo de Prueba:** Funcional / Positiva / Lógica de Negocio
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con equipo asignado que cuenta con agentes vinculados.

---

### Datos de Prueba (Test Data)
- **Selector:** `select#assigned_to` (etiqueta `Agente Responsable`)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Verificar el selector `select#assigned_to` antes de asignar equipo | Sin equipo | El selector está deshabilitado y muestra `Primero asigne un equipo` |
| **2** | Asignar un equipo en `select#team_id` | Selección de equipo | `select#team_id` |
| **3** | Abrir el selector `select#assigned_to` | N/A | Muestra exclusivamente los agentes que pertenecen al equipo seleccionado |
| **4** | Elegir un agente responsable | Selección de agente | `select#assigned_to` |
| **5** | Verificar la persistencia automática e historial | N/A | Entrada: `Cambió Agente responsable a '{Nombre}'` |

---

### Resultado Esperado
1. El selector filtra estrictamente a los agentes según el `team_id` asignado.
2. Al cambiar de equipo, el agente previo se desvincula si no pertenece al nuevo equipo.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-08`
- **Módulo / Funcionalidad:** 3. Service Agent / Gestión de Estados
- **Título:** Cambiar estado en flujo de atención (Nuevo → En Progreso → Resuelto)
- **Tipo de Prueba:** Funcional / Positiva / Ciclo de Vida
- **Etiquetas:** `@Smoke` `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud en estado inicial `NEW` ('Nuevo').

---

### Datos de Prueba (Test Data)
- **Selector:** `select#status` (etiqueta `Estado`)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `Propiedades`, ubicar el selector `select#status` | N/A | Selector con valor inicial `Nuevo` |
| **2** | Cambiar a `En Progreso` (`IN_PROGRESS`) | Selección `En Progreso` | `select#status` |
| **3** | Verificar guardado automático y entrada en historial | N/A | `Cambió Estado a 'IN_PROGRESS'` |
| **4** | Cambiar a `Resuelto` (`RESOLVED`) | Selección `Resuelto` | `select#status` |
| **5** | Verificar la actualización de fecha de resolución en el bloque SLA | N/A | Campo `Resuelto en:` con fecha/hora actual |

---

### Resultado Esperado
1. Todas las transiciones de estado se ejecutan exitosamente.
2. Al resolver, se consolida la marca temporal de resolución para el SLA.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-11`
- **Módulo / Funcionalidad:** 3. Service Agent / Comentarios
- **Título:** Agregar comentario público visible para el Customer
- **Tipo de Prueba:** Funcional / Positiva / Comunicación
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Agente en `/agent/requests/{id}`.
2. Solicitud creada por un Customer.

---

### Datos de Prueba (Test Data)
- **Texto:** `Hemos aplicado el parche correctivo. Por favor confirme el funcionamiento.`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En la tarjeta `Comentarios y Notas`, ingresar el texto en `textarea#new_comment` | Datos de prueba | Campo de texto para comentarios |
| **2** | Asegurarse de mantener DESMARCADO el checkbox `Solo visible para agentes (Nota Interna)` | Checkbox desmarcado | `input[type='checkbox']` |
| **3** | Hacer clic en el botón `Agregar Comentario` | Clic | Botón con texto `Agregar Comentario` |
| **4** | Iniciar sesión como Customer y abrir `/user/requests/{id}` | Ruta de cliente | Detalle de cliente |
| **5** | Verificar la presencia del comentario en `Actividad y Respuestas` | N/A | Comentario visible con autor y fecha |

---

### Resultado Esperado
1. El comentario se publica con alcance público y resulta visible tanto para el personal técnico como para el cliente.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-AGENT-13`
- **Módulo / Funcionalidad:** 3. Service Agent / Auditoría
- **Título:** Consultar historial completo de cambios y auditoría
- **Tipo de Prueba:** Funcional / Auditoría
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con diversas modificaciones previas (categoría, prioridad, estado, equipo).

---

### Datos de Prueba (Test Data)
- **Componente:** `RequestHistory` en `/agent/requests/{id}`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/agent/requests/{id}`, desplazarse a la tarjeta `Historial de Cambios` | N/A | Contenedor de historial |
| **2** | Inspeccionar las entradas del timeline vertical | N/A | Lista cronológica inversa |
| **3** | Verificar que cada entrada especifique: autor, acción formateada en lenguaje claro y fecha/hora | N/A | Ej. `admin Cambió Estado a 'RESOLVED'` |

---

### Resultado Esperado
1. Cada evento de cambio queda auditado con nombre de usuario, valor asignado y fecha precisa.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

# Módulo 4. SLA

---

### Metadatos del Caso de Prueba
- **ID:** `TC-SLA-02`
- **Módulo / Funcionalidad:** 4. SLA / Consulta de SLA
- **Título:** Consultar SLA muestra vencimiento de respuesta y resolución
- **Tipo de Prueba:** Funcional / SLA / Cálculo
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con SLA calculado a partir de la prioridad asignada.

---

### Datos de Prueba (Test Data)
- **Tarjeta:** `SLA (Tiempos)` en `/agent/requests/{id}`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/agent/requests/{id}`, ubicar la tarjeta `SLA (Tiempos)` en la sidebar | N/A | Tarjeta con icono `Clock` |
| **2** | Inspeccionar el bloque `Respuesta` | N/A | Muestra estado (`A tiempo` / `Pendiente`) y `Vencimiento:` |
| **3** | Inspeccionar el bloque `Resolución` | N/A | Muestra estado y fecha límite en `Vencimiento:` |

---

### Resultado Esperado
1. La tarjeta presenta los plazos límites de respuesta y resolución coherentes con la configuración del SLA.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-SLA-03`
- **Módulo / Funcionalidad:** 4. SLA / Alertas de SLA
- **Título:** Detecta solicitud con vencimiento próximo o en plazo
- **Tipo de Prueba:** Funcional / Reglas de Negocio
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con fecha límite vigente.

---

### Datos de Prueba (Test Data)
- **Solicitud dentro de plazo:** Fecha de vencimiento futura

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Abrir el detalle de la solicitud en `/agent/requests/{id}` | N/A | Vista de detalle |
| **2** | Inspeccionar el badge de estado en el bloque SLA | N/A | Badge con icono `CheckCircle2` o texto `A tiempo` |
| **3** | Verificar que no existan advertencias de incumplimiento | N/A | Indicadores visuales normales |

---

### Resultado Esperado
1. La solicitud se muestra en estado conforme ('A tiempo') sin alertas de penalización.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-SLA-04`
- **Módulo / Funcionalidad:** 4. SLA / Alertas de SLA
- **Título:** Marca solicitud con indicador y badge 'Vencido' cuando expira
- **Tipo de Prueba:** Funcional / Reglas de Negocio / Alertas
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud cuya fecha límite de SLA ha sido rebasada sin resolución.

---

### Datos de Prueba (Test Data)
- **Solicitud expirada:** `resolution_on_time: false`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Abrir la solicitud con SLA excedido en `/agent/requests/{id}` | N/A | Vista de detalle |
| **2** | Inspeccionar el bloque `Resolución` en la tarjeta `SLA (Tiempos)` | N/A | Bloque de resolución |
| **3** | Verificar el indicador de estado | N/A | Badge rojo con icono `AlertCircle` y texto `Vencido` |

---

### Resultado Esperado
1. La interfaz destaca de manera evidente el incumplimiento mediante el badge rojo de alerta `Vencido`."

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

# Módulo 5. Aprobaciones

---

### Metadatos del Caso de Prueba
- **ID:** `TC-APR-03`
- **Módulo / Funcionalidad:** 5. Aprobaciones / Flujo de Aprobación
- **Título:** Solicitud en categoría con aprobación genera registro 'Pendiente'
- **Tipo de Prueba:** Funcional / Integración / Flujo
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Media
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Categoría configurada con `requires_approval = true`.

---

### Datos de Prueba (Test Data)
- **Categoría:** `Compra de Equipamiento` (Requiere Aprobación: true)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/agent/requests/{id}`, asignar la categoría que requiere aprobación | Selección en `select#category_id` | Tarjeta Propiedades |
| **2** | Observar la barra lateral de la solicitud | N/A | Aparición de la tarjeta `Aprobaciones` (`RequestApprovals`) |
| **3** | Inspeccionar la tarjeta `Aprobaciones` | N/A | Registro con icono de reloj `Clock` y estado `Pendiente` junto al aprobador designado |

---

### Resultado Esperado
1. La tarjeta de aprobaciones se activa condicionalmente al asignar una categoría que requiere aprobación y muestra el registro en estado `Pendiente`.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-APR-04`
- **Módulo / Funcionalidad:** 5. Aprobaciones / Flujo de Aprobación
- **Título:** Aprobación exitosa por administrador actualiza registro a 'Aprobado'
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con aprobación pendiente.
2. Aprobador con rol Admin.

---

### Datos de Prueba (Test Data)
- **Aprobador:** `admin@serviceflow.com` / `admin123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | El aprobador autoriza la solicitud a través del endpoint o interfaz de aprobación | Aprobación | Petición a `/requests/{id}/approvals/{approvalId}` con status `APPROVED` |
| **2** | Abrir `/agent/requests/{id}` y ubicar la tarjeta `Aprobaciones` | N/A | Tarjeta `Aprobaciones` |
| **3** | Verificar el estado visual de la aprobación | N/A | Badge verde con icono `CheckCircle2` y texto `Aprobado` |
| **4** | Comprobar el registro de fecha | N/A | Etiqueta: `Decidido el: {fecha/hora}` |

---

### Resultado Esperado
1. El estado cambia a `Aprobado` con check verde y se audita la fecha y hora de la decisión.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-APR-05`
- **Módulo / Funcionalidad:** 5. Aprobaciones / Flujo de Aprobación
- **Título:** Rechazo de aprobación muestra estado 'Rechazado' y comentario
- **Tipo de Prueba:** Funcional / Negativa / Flujo
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitud con aprobación pendiente.

---

### Datos de Prueba (Test Data)
- **Comentario de rechazo:** `El monto solicitado excede el presupuesto disponible.`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | El aprobador rechaza la solicitud registrando un motivo en el comentario | Rechazo con motivo | Status `REJECTED` |
| **2** | Consultar la tarjeta `Aprobaciones` en `/agent/requests/{id}` | N/A | Tarjeta `Aprobaciones` |
| **3** | Verificar el icono y texto de estado | N/A | Icono `XCircle` y texto rojo `Rechazado` |
| **4** | Verificar la justificación expuesta | N/A | Texto entre comillas: `\"El monto solicitado excede el presupuesto disponible.\"` |

---

### Resultado Esperado
1. La aprobación refleja el rechazo con su icono característico y expone el motivo documentado por el aprobador.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-APR-06`
- **Módulo / Funcionalidad:** 5. Aprobaciones / Flujo de Aprobación
- **Título:** Consultar estado de aprobación en sidebar de la solicitud
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Solicitudes en estados Pendiente, Aprobado y Rechazado.

---

### Datos de Prueba (Test Data)
- **Estados de prueba:** `PENDING`, `APPROVED`, `REJECTED`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Abrir una solicitud con aprobación pendiente | N/A | Tarjeta Aprobaciones muestra `Pendiente` |
| **2** | Abrir una solicitud con aprobación aprobada | N/A | Tarjeta Aprobaciones muestra `Aprobado` |
| **3** | Abrir una solicitud con aprobación rechazada | N/A | Tarjeta Aprobaciones muestra `Rechazado` |

---

### Resultado Esperado
1. Los tres estados se distinguen nítidamente con sus respectivos iconos, colores y datos del aprobador.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

# Módulo 6. Service Admin

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-01`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Usuarios
- **Título:** Crear usuario nuevo con rol (Admin/Agent/User) y clave temporal
- **Tipo de Prueba:** Funcional / Positiva / Gestión de Usuarios
- **Etiquetas:** `@Smoke` `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Sesión iniciada con rol Admin (`admin@serviceflow.com` / `admin123`).
2. Ruta `/admin/users` accesible.

---

### Datos de Prueba (Test Data)
- **Nombre:** `Carlos Gómez`
- **Email:** `carlos.gomez@serviceflow.com`
- **Rol:** `AGENT`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/admin/users`, hacer clic en el botón `Crear Usuario` | Clic | Botón en cabecera de sección |
| **2** | En el modal `Crear Usuario`, completar `input#user-name` y `input#user-email` | Datos de prueba | Campos Nombre y Email |
| **3** | Seleccionar el rol en `select#user-role` | `AGENT` | Selector de Rol |
| **4** | Seleccionar equipo en `select#user-team` y dejar la contraseña vacía | Sin contraseña manual | Generación de clave temporal |
| **5** | Hacer clic en `Crear Usuario` | Clic | Botón de guardado |
| **6** | Verificar la aparición del modal `Contraseña Temporal` con la clave generada y botón `Listo` | N/A | Modal de clave temporal |

---

### Resultado Esperado
1. El usuario se da de alta en la base de datos con rol `AGENT`.
2. Se genera y expone la contraseña temporal para su primer acceso.
3. El usuario aparece en la tabla con badges de rol y estado `Activo`.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-02`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Usuarios
- **Título:** Consultar tabla de usuarios con buscador y filtro por rol
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Existen múltiples usuarios con diferentes roles en `/admin/users`.

---

### Datos de Prueba (Test Data)
- **Buscador:** `input[type='search']`
- **Filtro:** `select[aria-label='Filtrar por rol']`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/admin/users`, ingresar un término de búsqueda en `input[type='search']` | `admin` | Buscador con placeholder `Buscar por usuario o email` |
| **2** | Presionar Enter o clic en botón de búsqueda | Búsqueda | Botón lupa con `aria-label='Buscar usuarios'` |
| **3** | Verificar los resultados filtrados | N/A | Tabla de usuarios |
| **4** | Seleccionar un rol en `select[aria-label='Filtrar por rol']` | `AGENT` | Selector con opciones `Todos los roles`, `ADMIN`, `AGENT`, `USER` |

---

### Resultado Esperado
1. La tabla responde de forma fluida a las combinaciones de búsqueda textual y filtrado por rol.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-03`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Usuarios
- **Título:** Editar datos de usuario (nombre, equipo, estado activo)
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Usuario existente registrado en el sistema.

---

### Datos de Prueba (Test Data)
- **Nuevo Nombre:** `Carlos Gómez Editado`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En la fila del usuario, hacer clic en el botón de edición | Clic | Botón con icono `Pencil` (`aria-label='Editar usuario {nombre}'`) |
| **2** | En el modal `Editar Usuario`, modificar el campo `input#user-name` | `Carlos Gómez Editado` | Campo Nombre |
| **3** | Hacer clic en el botón `Guardar Cambios` | Clic | Botón `Guardar Cambios` |
| **4** | Verificar que la tabla se actualice con el nuevo nombre | N/A | Tabla de usuarios |

---

### Resultado Esperado
1. Los datos se actualizan exitosamente y el rol del usuario se mantiene intacto.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-04`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Usuarios
- **Título:** Asignar / cambiar rol de usuario y validar permisos del portal
- **Tipo de Prueba:** Funcional / Seguridad / RBAC
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Usuario registrado con rol `USER`.

---

### Datos de Prueba (Test Data)
- **Usuario:** `usuario.prueba@serviceflow.com`
- **Nuevo Rol:** `AGENT`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Abrir el modal de edición del usuario en `/admin/users` | Clic en lápiz | Modal `Editar Usuario` |
| **2** | En el selector `select#user-role`, cambiar de `USER` a `AGENT` | `AGENT` | Selector de Rol |
| **3** | Guardar los cambios haciendo clic en `Guardar Cambios` | Clic | Botón de guardado |
| **4** | Iniciar sesión con las credenciales de dicho usuario | Credenciales | Pantalla de Login |
| **5** | Verificar la redirección a `/agent/requests` y la interfaz de agente | N/A | Área de Agente |

---

### Resultado Esperado
1. El cambio de rol surte efecto inmediato en los permisos de navegación y en la asignación de áreas (`ROLE_AREA`).

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-05`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Equipos
- **Título:** Crear equipo de soporte con nombre y descripción
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Sesión como Admin en `/admin/teams`.

---

### Datos de Prueba (Test Data)
- **Nombre:** `Soporte Base de Datos`
- **Descripción:** `Administración y resolución de incidentes en bases PostgreSQL`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Navegar a `/admin/teams` desde el menú superior | Clic en `Equipos` | Página de Equipos |
| **2** | Hacer clic en el botón `Crear Equipo` | Clic | Botón de acción en cabecera |
| **3** | En el modal `Crear Equipo`, ingresar `Nombre` y `Descripción` | Datos de prueba | `input#team-name` y `textarea#team-description` |
| **4** | Hacer clic en `Crear Equipo` | Clic | Botón de guardado |
| **5** | Verificar la adición del nuevo equipo en la tabla | N/A | Tabla de equipos |

---

### Resultado Esperado
1. El equipo se crea con éxito y queda habilitado para la asignación de tickets y vinculación de miembros.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-06`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Equipos
- **Título:** Editar equipo y gestionar miembros (agregar/quitar)
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Equipo existente en `/admin/teams`.
2. Existen agentes disponibles para vincular.

---

### Datos de Prueba (Test Data)
- **Búsqueda de miembros:** `input[aria-label='Buscar usuario para agregar al equipo']`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En la fila del equipo, hacer clic en el botón de edición | Clic | Botón lápiz (`aria-label='Editar equipo {nombre}'`) |
| **2** | En el modal `Editar Equipo`, modificar el nombre o descripción | Nuevos textos | Campos del formulario |
| **3** | En la sección `Miembros`, escribir en el buscador de usuarios | Nombre de agente | Campo de búsqueda con icono `Search` |
| **4** | Hacer clic en el candidato deseado de la lista | Clic en candidato | Lista `team-candidates` |
| **5** | Para remover un miembro, presionar el botón `X` junto a su nombre | Clic en `X` | Botón `Quitar {nombre} del equipo` |
| **6** | Guardar cambios con `Guardar Cambios` | Clic | Botón de guardado |

---

### Resultado Esperado
1. Los miembros agregados o removidos se sincronizan con el equipo y se actualiza el contador de la tabla.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-07`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Categorías
- **Título:** Crear categoría con checkbox 'Requiere aprobación' marcado
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Sesión como Admin en `/admin/categories`.

---

### Datos de Prueba (Test Data)
- **Nombre:** `Adquisición de Licencias`
- **Descripción:** `Solicitudes de software corporativo con costo`
- **Requiere aprobación:** `true` (marcado)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/admin/categories`, hacer clic en `Crear Categoría` | Clic | Botón en cabecera |
| **2** | En el modal `Crear Categoría`, ingresar `Nombre` y `Descripción` | Datos de prueba | `input#category-name` y `textarea#category-description` |
| **3** | Marcar el checkbox `Requiere aprobación` | Check activo | `input[type='checkbox']` |
| **4** | Hacer clic en `Crear Categoría` | Clic | Botón de guardado |
| **5** | Verificar en la tabla que la columna `Requiere Aprobación` presente el badge verde `Sí` | N/A | Badge `Sí` en la fila |

---

### Resultado Esperado
1. La categoría se crea con la regla de aprobación activa, provocando que los tickets asignados a ella demanden autorización.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-08`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Categorías
- **Título:** Crear categoría sin requerimiento de aprobación
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Mayor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Sesión como Admin en `/admin/categories`.

---

### Datos de Prueba (Test Data)
- **Nombre:** `Consultas Generales`
- **Requiere aprobación:** `false` (desmarcado)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/admin/categories`, hacer clic en `Crear Categoría` | Clic | Botón `Crear Categoría` |
| **2** | Ingresar nombre y descripción dejando el checkbox `Requiere aprobación` DESMARCADO | Checkbox inactivo | `input[type='checkbox']` |
| **3** | Hacer clic en `Crear Categoría` | Clic | Botón de guardado |
| **4** | Verificar en la tabla el badge gris `No` en la columna de aprobación | N/A | Badge `No` en la fila |

---

### Resultado Esperado
1. La categoría se da de alta sin requisito de aprobación y los tickets asociados se gestionan de forma directa.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-09`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Categorías
- **Título:** Editar nombre o requerimiento de aprobación en categoría existente
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Categoría existente en `/admin/categories`.

---

### Datos de Prueba (Test Data)
- **Nuevo Nombre:** `Consultas Técnicas Generales`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En la fila de la categoría, hacer clic en el botón de editar | Clic | Botón lápiz `Pencil` |
| **2** | En el modal `Editar Categoría`, actualizar el campo de texto | `Consultas Técnicas Generales` | `input#category-name` |
| **3** | Alternar o mantener el checkbox `Requiere aprobación` | N/A | `input[type='checkbox']` |
| **4** | Hacer clic en `Guardar Cambios` | Clic | Botón de guardado |

---

### Resultado Esperado
1. La categoría se actualiza y el nuevo nombre se refleja en la tabla y en los selectores de los agentes.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-10`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Prioridades
- **Título:** Crear prioridad con nombre y nivel numérico (1 a 10)
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Media (P2)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Sesión como Admin en `/admin/priorities`.

---

### Datos de Prueba (Test Data)
- **Nombre:** `Urgente`
- **Nivel:** `1` (Rango válido: 1 a 10)

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Navegar a `/admin/priorities` desde la barra superior | Clic en `Prioridades` | Página de Prioridades |
| **2** | Hacer clic en el botón `Crear Prioridad` | Clic | Botón en cabecera |
| **3** | En el modal `Crear Prioridad`, ingresar nombre y nivel | `Urgente` / `1` | `input#priority-name` e `input#priority-level` |
| **4** | Hacer clic en `Crear Prioridad` | Clic | Botón de guardado |
| **5** | Verificar la aparición de la prioridad en la tabla | N/A | Tabla con columnas `Prioridad`, `Nivel`, `Acciones` |

---

### Resultado Esperado
1. La prioridad se almacena con su nivel numérico y queda inmediatamente disponible para categorizar tickets.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `TC-ADM-11`
- **Módulo / Funcionalidad:** 6. Service Admin / Gestión de Prioridades
- **Título:** Editar nombre o nivel de prioridad existente
- **Tipo de Prueba:** Funcional / Positiva
- **Etiquetas:** `@Regression` `@positive`
- **Prioridad:** Baja (P3)
- **Severidad:** Menor
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Prioridad existente en `/admin/priorities`.

---

### Datos de Prueba (Test Data)
- **Nuevo Nombre:** `Urgente - Bloqueante`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En la fila de la prioridad, hacer clic en el botón de editar | Clic | Botón lápiz `Pencil` |
| **2** | En el modal `Editar Prioridad`, modificar el nombre o nivel | `Urgente - Bloqueante` | `input#priority-name` |
| **3** | Hacer clic en `Guardar Cambios` | Clic | Botón de guardado |
| **4** | Verificar la actualización en la tabla | N/A | Tabla de prioridades |

---

### Resultado Esperado
1. Los cambios en la prioridad se guardan y propagan a las vistas del sistema.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

# Módulo 9. Smoke (pre-build)

---

### Metadatos del Caso de Prueba
- **ID:** `SM-01`
- **Módulo / Funcionalidad:** 9. Smoke (pre-build) / Smoke Test
- **Título:** Login exitoso con cada rol (Customer → /user, Agent → /agent, Admin → /admin)
- **Tipo de Prueba:** Smoke / Funcional / Sanity
- **Etiquetas:** `@Smoke` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Servidores Front-End (`localhost:3000`) y Back-End (`localhost:8000`) activos.
2. Usuarios de los 3 roles preconfigurados en base de datos.

---

### Datos de Prueba (Test Data)
- **Customer:** `user@serviceflow.com` / `user123`
- **Agent:** `linder@serviceflow.com` / `agent123`
- **Admin:** `admin@serviceflow.com` / `admin123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Iniciar sesión con credenciales de Customer y verificar redirección | `user@serviceflow.com` | Redirección a `/user` con Brand `Portal de Solicitudes` |
| **2** | Cerrar sesión mediante botón en header | Clic | Redirección a `/login` |
| **3** | Iniciar sesión con credenciales de Agent y verificar redirección | `linder@serviceflow.com` | Redirección a `/agent/requests` con Brand `Área de Agente` |
| **4** | Cerrar sesión | Clic | Redirección a `/login` |
| **5** | Iniciar sesión con credenciales de Admin y verificar redirección | `admin@serviceflow.com` | Redirección a `/admin/users` con Brand `Área de Administración` |

---

### Resultado Esperado
1. Los tres roles inician sesión sin errores y acceden exactamente al área funcional que les corresponde según RBAC.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `SM-02`
- **Módulo / Funcionalidad:** 9. Smoke (pre-build) / Smoke Test
- **Título:** Crear solicitud básica desde el modal de usuario
- **Tipo de Prueba:** Smoke / Funcional
- **Etiquetas:** `@Smoke` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Customer con sesión iniciada en `/user`.

---

### Datos de Prueba (Test Data)
- **Descripción:** `Prueba de smoke test para verificación de flujo de creación.`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | Hacer clic en el botón `Crear Solicitud` en `/user` | Clic | Botón en cabecera |
| **2** | Completar `textarea#description` con el texto de prueba | Datos de prueba | Campo de requerimiento |
| **3** | Hacer clic en `Crear Solicitud` dentro del modal | Clic | Botón de confirmación |
| **4** | Verificar que la nueva solicitud aparezca listada en la tabla | N/A | Lista con badge `Nuevo` / `#REQ-{id}` |

---

### Resultado Esperado
1. La solicitud se genera satisfactoriamente y el portal de cliente la muestra de forma inmediata.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---

### Metadatos del Caso de Prueba
- **ID:** `SM-03`
- **Módulo / Funcionalidad:** 9. Smoke (pre-build) / Smoke Test
- **Título:** Ver detalle de solicitud con navegación fluida
- **Tipo de Prueba:** Smoke / Funcional
- **Etiquetas:** `@Smoke` `@positive`
- **Prioridad:** Alta (P1)
- **Severidad:** Crítica
- **Automatizado:** No (ejecución manual / UI)
- **Referencia de Automatización:** N/A
- **Autor:** Andres Adrian Estrada

---

### Precondiciones
1. Existe al menos una solicitud en el listado del Customer.

---

### Datos de Prueba (Test Data)
- **Customer:** `user@serviceflow.com` / `user123`

---

### Pasos de Ejecución (Test Steps)
| Paso # | Acción del Usuario | Datos / Parámetros | Elemento de Interfaz / Localizador |
| :---: | :--- | :--- | :--- |
| **1** | En `/user`, hacer clic en la fila de una solicitud | Clic | Fila en `RequestList` |
| **2** | Verificar la transición hacia `/user/requests/{id}` | Navegación | Vista de detalle |
| **3** | Comprobar la carga de descripción, código `#REQ-{id}`, badge y sección de comentarios | N/A | Elementos de interfaz |

---

### Resultado Esperado
1. La vista de detalle carga todos los datos sin errores de consola ni interrupciones.

---

### Resultado Actual y Evidencias (Para Ejecución Manual)
- **Estado:** [X] Aprobado (Passed)  [ ] Fallido (Failed)  [ ] Bloqueado (Blocked)
- **Fecha de Ejecución:** 2026-10-01
- **Ejecutado por:** Andres Adrian Estrada
- **Defecto Asociado:** N/A

---
