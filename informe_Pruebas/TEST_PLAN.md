# Plan de Pruebas — ServiceFlow MVP

**Proyecto:** ServiceFlow (No Country — S08-26-Equipo-20)
**Versión:** 1.1
**Responsable del plan:** Andrés Uzeda (QA Engineer)

---

## 1. Introducción y objetivo

Este documento define la estrategia, el alcance, los recursos y los criterios con los que se verificará que el MVP de ServiceFlow (sistema de gestión de solicitudes de servicio con roles Customer, Service Agent y Service Admin) cumple los requisitos funcionales, de seguridad y de calidad acordados antes de su liberación.

Objetivos específicos:
- Validar los flujos de negocio de extremo a extremo.
- Confirmar que los permisos por rol se aplican en el backend, no solo en la interfaz.
- Verificar el cálculo y seguimiento de SLA.
- Comprobar que el flujo de aprobaciones es trazable.

## 2. Alcance

### Dentro del alcance
- Autenticación, sesiones, tokens JWT y comportamiento general del sistema.
- Customer: crear, consultar y comentar solicitudes; adjuntar archivos.
- Service Agent: categorizar, priorizar, asignar, cambiar estado, comentar y consultar historial.
- SLA: cálculo, tiempo restante, alerta de riesgo e incumplimiento.
- Aprobaciones: disparo automático y manual, aprobar/rechazar, trazabilidad.
- Service Admin: gestión de usuarios, roles, equipos, categorías y prioridades.
- Seguridad: IDOR, manipulación de JWT, bypass de UI y escalamiento de privilegios.
- Smoke pre-build y entorno Docker.

### Fuera del alcance
- Automatización de la capa UI (los 46 casos de UI se ejecutan manualmente; queda como mejora futura).
- Pruebas de carga/estrés y de rendimiento más allá del tiempo de respuesta básico (TC-SYS-05).
- Pruebas de compatibilidad en múltiples navegadores y dispositivos.
- Pruebas de penetración profesionales; solo se cubren los controles de seguridad listados.
- Módulo 8 (Regresión): no tiene IDs propios; se ejecuta reutilizando los casos existentes (ver sección 5).

## 3. Estrategia de pruebas

| Capa | Qué cubre | Enfoque | Casos |
| :--- | :--- | :--- | :---: |
| API | Permisos y tokens (401/403), IDOR, validaciones y reglas de negocio, cálculo de SLA, contrato de la API, infraestructura (Docker, health check). | **Automatizada** con Playwright + Node.js (`tests/E2E_API/`); reportes en Playwright HTML / Allure. | 31 |
| UI | Flujos en pantalla: login, formularios, listados, detalle, cambios de estado, administración y vistas de aprobación. | **Manual**, siguiendo los casos escritos. | 46 |
| **Total** | | | **77** |

Alcance de la automatización: se automatizaron los 31 casos de API (40% del total), lo que da repetibilidad en regresión, sobre todo para seguridad, permisos y reglas de SLA. Los 46 casos de UI (60%) dependen de ejecución manual, por lo que el esfuerzo de regresión de UI es mayor y debe planificarse.

Tipos de prueba aplicados: funcional, de validación de datos, de seguridad y autorización, de contrato de API, smoke y regresión. La prioridad (Alta / Media / Baja) determina el orden de ejecución: primero smoke, luego Alta, luego Media y Baja.

## 4. Cobertura por módulo

| Módulo | API | UI | Total |
| :--- | :---: | :---: | :---: |
| 1. Autenticación y Sistema | 11 | 4 | 15 |
| 2. Customer: Solicitudes | 2 | 11 | 13 |
| 3. Service Agent | 3 | 10 | 13 |
| 4. SLA | 4 | 3 | 7 |
| 5. Aprobaciones | 4 | 4 | 8 |
| 6. Service Admin | 1 | 11 | 12 |
| 7. Seguridad | 5 | 0 | 5 |
| 9. Smoke (pre-build) | 1 | 3 | 4 |
| **Total** | **31** | **46** | **77** |

### Distribución por prioridad

| Prioridad | API | UI | Total |
| :--- | :---: | :---: | :---: |
| Alta | 21 | 26 | 47 |
| Media | 9 | 19 | 28 |
| Baja | 0 | 1 | 1 |
| Sin prioridad (SM-04) | 1 | 0 | 1 |

El detalle de cada caso se mantiene en `CASOS_DE_PRUEBA_DETALLADOS.md` (API), `CASOS_DE_PRUEBA_UI_DETALLADOS.md` (UI) y `SEGUIMIENTO_EJECUCION.md` (resultados).

## 5. Estrategia de regresión

El Módulo 8 no tiene casos propios. Ante cualquier corrección de un defecto se repite el caso que falló más los casos Alta del mismo módulo. Antes de cada liberación se ejecuta el set completo de smoke (SM-01 a SM-04) y los casos de Seguridad (TC-SEC-01 a 05). Los casos de API se re-ejecutan completos con la suite automatizada; en UI se repiten manualmente los casos Alta del módulo afectado.

## 6. Entorno y datos de prueba

- Entorno: servicios levantados con Docker (validado por TC-SYS-04 y SM-04).
- API: `http://localhost:8000`. Frontend: `http://localhost:3000` (confirmar).
- Versión/build bajo prueba: `[completar]`.
- Usuarios de prueba: Admin → `admin@serviceflow.com`, Agent → `linder@serviceflow.com`, Customer → `user@serviceflow.com`. Se necesita además un segundo Customer para los casos IDOR y de "Mis solicitudes". El Admin actúa como aprobador.
- Datos: categorías con y sin "Requiere Aprobación", prioridades con su SLA, equipos con miembros y archivos de prueba (formato válido, formato no permitido y tamaño excedido).
- Herramientas: Playwright + Node.js (API), navegador (UI manual), Allure y gestor de bugs `[confirmar]`.

## 7. Criterios de entrada, salida y suspensión

**Entrada**
- Build desplegado en el entorno de pruebas y smoke (SM-01 a SM-04) en estado Pasó.
- Usuarios y datos de prueba creados.
- Casos de prueba revisados y aprobados.

**Salida**
- 100% de los casos ejecutados (sin casos Pendientes).
- 100% de los casos de prioridad Alta en Pasó.
- Cero defectos abiertos de severidad crítica o alta.

**Suspensión y reanudación**
- Se suspende si falla el smoke, el entorno no está disponible o un defecto bloqueante impide ejecutar más del 20% de los casos restantes.
- Se reanuda cuando el defecto está corregido y el smoke vuelve a pasar.

## 8. Gestión de defectos

Los defectos se registran con un ID (formato BUG-n) y se enlazan al caso en la columna "Observaciones / Bug". Cada reporte incluye pasos para reproducir, resultado esperado y obtenido, rol usado, entorno y evidencia.

| Severidad | Definición | Ejemplo |
| :--- | :--- | :--- |
| Crítica | Bloquea el sistema o compromete seguridad o datos. | Customer accede a solicitudes ajenas (IDOR). |
| Alta | Falla una función principal sin alternativa. | No se puede crear una solicitud. |
| Media | Falla una función secundaria o hay alternativa. | El tiempo restante de SLA se muestra mal. |
| Baja | Problema cosmético o menor. | Mensaje de validación con texto confuso. |

Estados del resultado: Pasó, Falló, Bloqueado y Pendiente. Métricas: % Ejecutado (casos no Pendientes ÷ total) y % Pasó (casos en Pasó ÷ total).

## 9. Riesgos y mitigación

| Riesgo | Mitigación |
| :--- | :--- |
| Fallas de autorización (IDOR, JWT alterado, escalamiento de rol) con alto impacto. | Ejecutar primero los casos de Seguridad y permisos; repetirlos en cada regresión. |
| El cálculo de SLA depende de husos horarios y fines de semana (TC-SLA-07). | Preparar datos con fechas límite y zonas horarias distintas; validar con valores calculados a mano. |
| Dependencia de múltiples roles y datos preparados. | Mantener un set de usuarios y datos documentado y reproducible. |
| La UI no está automatizada: la regresión de UI es manual y lenta. | Priorizar regresión manual de UI en casos Alta; evaluar automatizar primero los smoke (SM-01 a SM-03). |
| Regresión sin casos propios (Módulo 8). | Usar la estrategia de la sección 5 y definir el set formal si el proyecto continúa. |
| Entorno Docker inestable. | Smoke obligatorio antes de cada ciclo. |

## 10. Equipo, roles y responsabilidades

| Integrante | Rol | Responsabilidad en las pruebas |
| :--- | :--- | :--- |
| Andrés Uzeda | QA Engineer | Elaborar y mantener el plan y los casos, automatizar la API, ejecutar las pruebas manuales de UI, reportar defectos y emitir el informe final. |
| Matias Bertuccio | Software Engineer | Corregir defectos asignados, apoyar con datos de prueba y desplegar builds en el entorno de pruebas. |
| Alexis Albarenga | Software Engineer | Corregir defectos asignados, apoyar con datos de prueba y desplegar builds en el entorno de pruebas. |
| Linder Rodríguez | Software Engineer | Corregir defectos asignados, apoyar con datos de prueba y desplegar builds en el entorno de pruebas. |

## 11. Cronograma

| Actividad | Inicio | Fin |
| :--- | :---: | :---: |
| Revisión de casos y preparación del entorno | 2026-09-14 | 2026-09-25 |
| Smoke pre-build | 2026-09-25 | 2026-09-25 |
| Ejecución automatizada de API (31 casos) | 2026-09-29 | 2026-09-29 |
| Ejecución manual de UI (46 casos) | 2026-09-29 | 2026-09-29 |
| Corrección y regresión | 2026-09-30 | 2026-09-30 |
| Informe final de pruebas | 2026-10-01 | 2026-10-01 |

## 12. Entregables

- `TEST_PLAN.md` (este documento).
- `CASOS_DE_PRUEBA_DETALLADOS.md` (API, 31 casos automatizados).
- `CASOS_DE_PRUEBA_UI_DETALLADOS.md` (UI, 46 casos manuales).
- `SEGUIMIENTO_EJECUCION.md` (resultados por caso).
- `INFORME_FINAL.md` (métricas y recomendación de salida).
- Reporte de ejecución de API (Playwright HTML / Allure).

## 13. Estado actual de ejecución

| Capa | Modalidad | Total | Pasó | Falló | Bloqueado | Pendiente |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| API | Automatizada | 31 | 31 | 0 | 0 | 0 |
| UI | Manual | 46 | 46 | 0 | 0 | 0 |
| **Total** | | **77** | **77** | **0** | **0** | **0** |
