# Seguimiento de Ejecución — ServiceFlow MVP

**Proyecto:** ServiceFlow (No Country — S08-26-Equipo-20)
**Valores de Resultado:** Pasó, Falló, Bloqueado, Pendiente.
**Clasificación:** cada caso está en una sola capa (API o UI).

## Resumen

| Capa | Total | Pasó | Falló | Bloqueado | Pendiente | % Ejecutado | % Pasó |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| API | 31 | 31 | 0 | 0 | 0 | 100% | 100% |
| UI | 46 | 46 | 0 | 0 | 0 | 100% | 100% |
| **Total** | **77** | **77** | **0** | **0** | **0** | **100%** | **100%** |

## Casos de API

| N° | ID | Módulo | Caso de prueba | Prioridad | Resultado | Observaciones / Bug |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | TC-AUTH-04 | 1. Autenticación y Sistema | Token Bearer token  generado contiene el rol correcto | Alta | Pasó |  |
| 2 | TC-AUTH-05 | 1. Autenticación y Sistema | Acceso a endpoint protegido sin token → 401 | Alta | Pasó |  |
| 3 | TC-AUTH-06 | 1. Autenticación y Sistema | Acceso con token expirado → 401 | Alta | Pasó |  |
| 4 | TC-AUTH-07 | 1. Autenticación y Sistema | Acceso con token manipulado (rol alterado, firma inválida) → 401/403 | Alta | Pasó |  |
| 5 | TC-AUTH-09 | 1. Autenticación y Sistema | Customer no accede a endpoints de Admin → 403 | Alta | Pasó |  |
| 6 | TC-AUTH-10 | 1. Autenticación y Sistema | Service Agent no accede a endpoints de Admin → 403 | Alta | Pasó |  |
| 7 | TC-SYS-01 | 1. Autenticación y Sistema | Validación de campos obligatorios al crear entidades | Media | Pasó |  |
| 8 | TC-SYS-02 | 1. Autenticación y Sistema | Error 404 no exponen información sensible (stack trace) | Media | Pasó |  |
| 9 | TC-SYS-03 | 1. Autenticación y Sistema | API responde con contrato esperado (status codes, formato JSON) | Media | Pasó |  |
| 10 | TC-SYS-04 | 1. Autenticación y Sistema | Entorno Docker levanta correctamente todos los servicios | Alta | Pasó |  |
| 11 | TC-SYS-05 | 1. Autenticación y Sistema | Tiempo de respuesta de la API con usuario válido autenticado (tiempo de espera hasta recibir respuesta) | Media | Pasó |  |
| 12 | TC-CUST-05 | 2. Customer: Solicitudes | Ver detalle de solicitud de otro customer → 403/404 (IDOR) | Alta | Pasó |  |
| 13 | TC-CUST-10 | 2. Customer: Solicitudes | Agregar comentario a solicitud de otro customer → rechazado | Alta | Pasó |  |
| 14 | TC-AGENT-09 | 3. Service Agent | Cambio de estado inválido (ej. Cerrada→Nueva) → rechazado | Media | Pasó |  |
| 15 | TC-AGENT-10 | 3. Service Agent | Resolver solicitud y validar timestamp de resolución | Alta | Pasó |  |
| 16 | TC-AGENT-12 | 3. Service Agent | Agregar nota interna NO visible para el customer | Alta | Pasó |  |
| 17 | TC-SLA-01 | 4. SLA | SLA se calcula correctamente según categoría/prioridad al crear | Alta | Pasó |  |
| 18 | TC-SLA-05 | 4. SLA | Registra tiempo de primera respuesta del agente | Media | Pasó |  |
| 19 | TC-SLA-06 | 4. SLA | Registra tiempo de resolución al cerrar la solicitud | Media | Pasó |  |
| 20 | TC-SLA-07 | 4. SLA | Cálculo correcto con husos horarios / fines de semana | Media | Pasó |  |
| 21 | TC-APR-01 | 5. Aprobaciones | Categoría "Requiere Aprobación=true" dispara el flujo automáticamente | Alta | Pasó |  |
| 22 | TC-APR-02 | 5. Aprobaciones | Categoría "Requiere Aprobación=false" NO dispara el flujo | Alta | Pasó |  |
| 23 | TC-APR-07 | 5. Aprobaciones | Trazabilidad: quién aprobó/rechazó y cuándo | Alta | Pasó |  |
| 24 | TC-APR-08 | 5. Aprobaciones | Customer no puede auto-aprobar su propia solicitud | Alta | Pasó |  |
| 25 | TC-ADM-12 | 6. Service Admin | Crear entidades duplicadas (nombre repetido) → validación | Media | Pasó |  |
| 26 | TC-SEC-01 | 7. Seguridad | IDOR: customer no ve solicitudes ajenas | Alta | Pasó |  |
| 27 | TC-SEC-02 | 7. Seguridad | IDOR: customer no accede a comentarios/archivos ajenos | Alta | Pasó |  |
| 28 | TC-SEC-03 | 7. Seguridad | Bypass de UI: endpoint restringido llamado con rol inferior vía API | Alta | Pasó |  |
| 29 | TC-SEC-04 | 7. Seguridad | JWT alterado (rol modificado sin re-firmar) → rechazado | Alta | Pasó |  |
| 30 | TC-SEC-05 | 7. Seguridad | Escalamiento por parámetro oculto ("role":"admin" en creación de usuario) | Alta | Pasó |  |
| 31 | SM-04 | 9. Smoke (pre-build) | Health check: todos los servicios levantan correctamente | — | Pasó |  |

## Casos de UI

| N° | ID | Módulo | Caso de prueba | Prioridad | Resultado | Observaciones / Bug |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | TC-AUTH-01 | 1. Autenticación y Sistema | Login exitoso con credenciales válidas | Alta | Pasó |  |
| 2 | TC-AUTH-02 | 1. Autenticación y Sistema | Login fallido con contraseña incorrecta | Alta | Pasó |  |
| 3 | TC-AUTH-03 | 1. Autenticación y Sistema | Login fallido con usuario inexistente | Media | Pasó |  |
| 4 | TC-AUTH-08 | 1. Autenticación y Sistema | Cierre de sesión invalida el token/sesión | Media | Pasó |  |
| 5 | TC-CUST-01 | 2. Customer: Solicitudes | Crear solicitud con todos los campos obligatorios completos | Alta | Pasó |  |
| 6 | TC-CUST-02 | 2. Customer: Solicitudes | Crear solicitud sin campo obligatorio → error de validación | Alta | Pasó |  |
| 7 | TC-CUST-03 | 2. Customer: Solicitudes | "Mis solicitudes" muestra solo las propias | Alta | Pasó |  |
| 8 | TC-CUST-04 | 2. Customer: Solicitudes | Ver detalle de una solicitud propia | Alta | Pasó |  |
| 9 | TC-CUST-06 | 2. Customer: Solicitudes | Estado se refleja correctamente tras cambios del agente | Alta | Pasó |  |
| 10 | TC-CUST-07 | 2. Customer: Solicitudes | Consultar prioridad asignada | Media | Pasó |  |
| 11 | TC-CUST-08 | 2. Customer: Solicitudes | Consultar equipo/responsable asignado | Media | Pasó |  |
| 12 | TC-CUST-09 | 2. Customer: Solicitudes | Agregar comentario a solicitud propia | Media | Pasó |  |
| 13 | TC-CUST-11 | 2. Customer: Solicitudes | Adjuntar archivo válido (formato/tamaño permitido) | Media | Pasó |  |
| 14 | TC-CUST-12 | 2. Customer: Solicitudes | Adjuntar archivo con formato no permitido → error | Media | Pasó |  |
| 15 | TC-CUST-13 | 2. Customer: Solicitudes | Adjuntar archivo que excede tamaño máximo → error | Media | Pasó |  |
| 16 | TC-AGENT-01 | 3. Service Agent | Consultar listado completo de solicitudes | Alta | Pasó |  |
| 17 | TC-AGENT-02 | 3. Service Agent | Ver detalle completo de cualquier solicitud | Alta | Pasó |  |
| 18 | TC-AGENT-03 | 3. Service Agent | Categorizar solicitud sin categoría asignada | Alta | Pasó |  |
| 19 | TC-AGENT-04 | 3. Service Agent | Cambiar categoría de una solicitud ya categorizada | Media | Pasó |  |
| 20 | TC-AGENT-05 | 3. Service Agent | Establecer prioridad (Alta/Media/Baja) | Alta | Pasó |  |
| 21 | TC-AGENT-06 | 3. Service Agent | Asignar equipo a la solicitud | Alta | Pasó |  |
| 22 | TC-AGENT-07 | 3. Service Agent | Asignar responsable dentro del equipo | Alta | Pasó |  |
| 23 | TC-AGENT-08 | 3. Service Agent | Cambiar estado en flujo válido (Nueva→En Progreso→Resuelta) | Alta | Pasó |  |
| 24 | TC-AGENT-11 | 3. Service Agent | Agregar comentario visible para el customer | Media | Pasó |  |
| 25 | TC-AGENT-13 | 3. Service Agent | Consultar historial completo (auditoría de cambios) | Media | Pasó |  |
| 26 | TC-SLA-02 | 4. SLA | Consultar SLA muestra tiempo restante correcto | Alta | Pasó |  |
| 27 | TC-SLA-03 | 4. SLA | Detecta solicitud próxima a incumplir SLA (umbral configurado) | Alta | Pasó |  |
| 28 | TC-SLA-04 | 4. SLA | Marca solicitud como "fuera de SLA" cuando corresponde | Alta | Pasó |  |
| 29 | TC-APR-03 | 5. Aprobaciones | Agente solicita aprobación explícitamente | Media | Pasó |  |
| 30 | TC-APR-04 | 5. Aprobaciones | Aprobador aprueba → estado avanza correctamente | Alta | Pasó |  |
| 31 | TC-APR-05 | 5. Aprobaciones | Aprobador rechaza → estado y motivo reflejan el rechazo | Alta | Pasó |  |
| 32 | TC-APR-06 | 5. Aprobaciones | Consultar estado de aprobación (pendiente/aprobada/rechazada) | Media | Pasó |  |
| 33 | TC-ADM-01 | 6. Service Admin | Crear usuario nuevo con rol asignado | Alta | Pasó |  |
| 34 | TC-ADM-02 | 6. Service Admin | Consultar listado de usuarios | Media | Pasó |  |
| 35 | TC-ADM-03 | 6. Service Admin | Editar datos de usuario (sin cambiar rol) | Media | Pasó |  |
| 36 | TC-ADM-04 | 6. Service Admin | Asignar/cambiar rol de un usuario | Alta | Pasó |  |
| 37 | TC-ADM-05 | 6. Service Admin | Crear equipo | Media | Pasó |  |
| 38 | TC-ADM-06 | 6. Service Admin | Editar equipo (nombre, miembros) | Media | Pasó |  |
| 39 | TC-ADM-07 | 6. Service Admin | Crear categoría con "Requiere Aprobación" = true | Alta | Pasó |  |
| 40 | TC-ADM-08 | 6. Service Admin | Crear categoría con "Requiere Aprobación" = false | Alta | Pasó |  |
| 41 | TC-ADM-09 | 6. Service Admin | Editar categoría existente | Media | Pasó |  |
| 42 | TC-ADM-10 | 6. Service Admin | Crear prioridad | Media | Pasó |  |
| 43 | TC-ADM-11 | 6. Service Admin | Editar prioridad | Baja | Pasó |  |
| 44 | SM-01 | 9. Smoke (pre-build) | Login exitoso con cada rol (Customer, Agent, Admin) | Alta | Pasó |  |
| 45 | SM-02 | 9. Smoke (pre-build) | Crear solicitud básica | Alta | Pasó |  |
| 46 | SM-03 | 9. Smoke (pre-build) | Ver detalle de solicitud | Alta | Pasó |  |
