# Informe Final de Pruebas — ServiceFlow MVP

**Proyecto:** ServiceFlow (No Country — S08-26-Equipo-20)
**Fecha del informe:** 2026-10-01
**Elaborado por:** Andrés Uzeda (QA Engineer)

---

## 1. Resumen ejecutivo

Entre el 14 de septiembre y el 1 de octubre de 2026 se ejecutó el plan de pruebas del MVP de ServiceFlow. Se ejecutaron los 77 casos planificados: 31 de API (automatizados con Playwright + Node.js) y 46 de UI (manuales). Los 77 resultaron en Pasó, sin casos fallidos, bloqueados ni pendientes, y sin defectos registrados en el archivo de seguimiento.

**Recomendación:** el MVP cumple los criterios de salida definidos en el plan y se recomienda su liberación, considerando las limitaciones de la sección 7.

## 2. Alcance ejecutado

Se cubrieron los módulos de Autenticación y Sistema, Customer: Solicitudes, Service Agent, SLA, Aprobaciones, Service Admin, Seguridad y Smoke pre-build. Las pruebas de carga/estrés, la automatización de UI y la compatibilidad entre navegadores quedaron fuera de alcance. El Módulo 8 (Regresión) no tiene casos propios; la regresión se hizo repitiendo los casos existentes.

## 3. Resultados por capa

| Capa | Modalidad | Total | Pasó | Falló | Bloqueado | Pendiente | % Pasó |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| API | Automatizada | 31 | 31 | 0 | 0 | 0 | 100% |
| UI | Manual | 46 | 46 | 0 | 0 | 0 | 100% |
| **Total** | | **77** | **77** | **0** | **0** | **0** | **100%** |

## 4. Resultados por módulo

| Módulo | API | UI | Total | Pasó |
| :--- | :---: | :---: | :---: | :---: |
| 1. Autenticación y Sistema | 11 | 4 | 15 | 15 |
| 2. Customer: Solicitudes | 2 | 11 | 13 | 13 |
| 3. Service Agent | 3 | 10 | 13 | 13 |
| 4. SLA | 4 | 3 | 7 | 7 |
| 5. Aprobaciones | 4 | 4 | 8 | 8 |
| 6. Service Admin | 1 | 11 | 12 | 12 |
| 7. Seguridad | 5 | 0 | 5 | 5 |
| 9. Smoke (pre-build) | 1 | 3 | 4 | 4 |
| **Total** | **31** | **46** | **77** | **77** |

Por prioridad: 47 casos Alta, 28 Media, 1 Baja y 1 sin prioridad (SM-04); todos en Pasó. Esto incluye los 5 casos de Seguridad (IDOR, JWT alterado, bypass de UI y escalamiento por parámetro oculto).

## 5. Defectos

No se registraron defectos en la columna "Observaciones / Bug" del archivo de seguimiento.


| Severidad | Abiertos | Cerrados |
| :--- | :---: | :---: |
| Crítica | 0 | 0 |
| Alta | 0 | 0 |
| Media | 0 | 0 |
| Baja | 0 | 0 |

## 6. Cumplimiento de los criterios de salida

| Criterio | Resultado | Estado |
| :--- | :--- | :---: |
| 100% de los casos ejecutados | 77 de 77 ejecutados | Cumple |
| 100% de los casos Alta en Pasó | 47 de 47 en Pasó | Cumple |
| Cero defectos críticos o altos abiertos | 0 abiertos | Cumple |

## 7. Limitaciones y riesgos residuales

- La UI se probó solo de forma manual; la regresión de UI futura requerirá repetir esos 46 casos o automatizarlos.
- No se realizaron pruebas de carga, estrés ni de compatibilidad entre navegadores y dispositivos.
- La seguridad se validó con los 5 casos definidos; no equivale a una prueba de penetración.
- El Módulo 8 (Regresión) no tiene casos formales propios.
- Los casos de SLA con huso horario y fines de semana (TC-SLA-07) dependen de los datos de prueba preparados.

## 8. Recomendaciones

- Liberar el MVP, dado que se cumplen los criterios de salida.
- Mantener la suite de API como regresión obligatoria en cada cambio, sobre todo los casos de seguridad y permisos.
- Automatizar primero los flujos smoke de UI (SM-01 a SM-03) en la siguiente fase.
- Definir un set formal de regresión (Módulo 8) y pruebas de rendimiento para versiones posteriores.

## 9. Cronograma ejecutado

| Actividad | Inicio | Fin |
| :--- | :---: | :---: |
| Revisión de casos y preparación del entorno | 2026-09-14 | 2026-09-25 |
| Smoke pre-build | 2026-09-25 | 2026-09-25 |
| Ejecución automatizada de API | 2026-09-29 | 2026-09-29 |
| Ejecución manual de UI | 2026-09-29 | 2026-09-29 |
| Corrección y regresión | 2026-09-30 | 2026-09-30 |
| Informe final | 2026-10-01 | 2026-10-01 |

## 10. Equipo

| Integrante | Rol |
| :--- | :--- |
| Andrés Uzeda | QA Engineer (autor del informe) |
| Matias Bertuccio | Software Engineer |
| Alexis Albarenga | Software Engineer |
| Linder Rodríguez | Software Engineer |

Documentos relacionados: `TEST_PLAN.md`, `CASOS_DE_PRUEBA_DETALLADOS.md`, `CASOS_DE_PRUEBA_UI_DETALLADOS.md`, `SEGUIMIENTO_EJECUCION.md`. Reporte de ejecución de API: Playwright HTML / Allure.
