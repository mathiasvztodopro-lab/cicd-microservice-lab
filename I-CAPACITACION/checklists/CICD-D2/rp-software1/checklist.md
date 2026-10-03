---
alumno: rp-software1
curso: CICD
dia: 2
estado: dia_2_completo
loom: (agregar link al terminar)
url_repo: https://github.com/mathiasvztodopro-lab/cicd-microservice-lab (publico)
---

## Secciones

- [x] A — Instalación de Jest + Supertest y primeros tests unitarios/integración
- [x] B — Matrix Builds en GitHub Actions: Validación paralela en Node 18, 20 y 22
- [x] C — Quality Gate: Configuración de umbral de cobertura estricto (80%)
- [ ] D — Consultoría arquitectónica con IA (Flaky tests y mocks en CI)
- [x] E — Auto-Auditoría: Simulación de fallo en Matrix y subida de artifacts
- [x] F — Bitácora de cierre individual

## Notas de implementación

1. La guía pide `calculateMetrics` en `src/index.ts`, pero ese archivo está
   EXCLUIDO de `collectCoverageFrom` en `jest.config.js` (`'!src/index.ts'`), y la
   razón de esa exclusión es correcta: el bootstrap del `listen` no es una unidad
   testeable. Con la función ahí, el Quality Gate no la habría visto nunca, porque
   ni el numerador ni el denominador de la métrica la incluyen. Por eso la función
   está en `src/app.ts`, que sí es el archivo medido: `src/app.ts` tiene 11 líneas,
   13 statements, 4 funciones y 6 branches, y las cuatro están al 100%.

2. Como consecuencia de lo anterior, `src/index.ts` se dividió en dos archivos:
   `src/app.ts` (Express + las dos rutas, 100% cubierto) y `src/index.ts` (bootstrap
   del `listen` + `export { app }`). El `export { app }` no es cosmético: el
   contrato de import del material es `../src/index`, así que sin ese re-export el
   import de los tests queda roto. Con la división, importar la app para testearla
   no arrastra el arranque del servidor, que además está guardado con
   `if (process.env.NODE_ENV !== 'test')`.

3. Se agregó un test extra a propósito. El tercer test de `GET /api/v1/info` borra
   `process.env.NODE_ENV`, pide la ruta y afirma `environment: 'development'`,
   restaurando la variable en un `finally`. Sin ese test, la expresión
   `process.env.NODE_ENV || 'development'` queda con una sola de sus dos ramas
   ejercitada y el contador de branches marca 50% para esa línea: con el resto del
   archivo al 100%, la caída de branches no llega al 80% global y el gate rechaza el
   merge. O sea: el umbral que obliga a probar el caso por defecto es el de
   branches, no el de statements.

4. El comando real de Jest NO coincide palabra por palabra con la guía. La guía
   muestra `Jest: "global" coverage threshold for lines (80%) not met: 72%`. Con
   Jest 30.5.2 el mensaje es distinto, y es por métrica (run #15, job
   `Automated Tests (Node 20.x)`):

   ```
   Jest: Coverage for statements (61.53%) does not meet "global" threshold (80%)
   Jest: Coverage for branches (33.33%) does not meet "global" threshold (80%)
   Jest: Coverage for lines (72.72%) does not meet "global" threshold (80%)
   Jest: Coverage for functions (50%) does not meet "global" threshold (80%)
   ##[error]Process completed with exit code 1.
   ```

   La sustancia es la misma que la del material: 72.72% de líneas contra un umbral
   de 80%. Lo que cambia es que Jest reporta las cuatro métricas por separado y que
   redondea a dos decimales. El 72% del material es el número de líneas.

5. La guía numera `dia1` en la sección del artefacto y en los comandos, pero los
   paths del microservicio son `I-CAPACITACION/api-service/...`: la guía los trae
   mal como `api-service/...`. Es el mismo error ya detectado y documentado el Día 1
   en el workflow (paths sin resolver en el `cache-dependency-path` de
   `setup-node`), propagado acá a los comandos de cobertura y a la ruta del
   `upload-artifact`.

6. Hallazgo sobre el material: los encabezados de página de las páginas del Día 2
   del PDF dicen "DIA 1 DE 7". Es un copy-paste sin corregir de la guía; el
   contenido sí es del Día 2 (Jest + Supertest, matrix, Quality Gate). Queda
   anotado para que no se confunda al corregir la numeración.

## Ticks pendientes

- [x] Artefacto de cobertura descargado desde la run y contenido verificado: zip
      `code-coverage-report-node-20`, 17 KB
- [x] PR bloqueado por el Quality Gate y después desbloqueado: PR #5 v1 quedó en
      `mergeable_state: blocked` (run #15, lint en verde y los 3 jobs del matrix en
      rojo), la v2 en verde (run #16), merge en `8e3958c`
- [x] Branch Protection de `main` con los 4 checks requeridos

## Ejecuciones de la pipeline (evidencia del día 2)

| run# | rama | evento | resultado | detalle |
|------|------|--------|-----------|---------|
| #13 | feat/dia2-jest-matrix-ci | pull_request | OK | PR #4: los 4 jobs en verde |
| #14 | main | push | OK | post-merge de PR #4 (`02188bf`) |
| #15 | feature/bypass-coverage | pull_request | FALLA | PR #5 v1: lint OK, los 3 jobs del matrix FALLAN por cobertura |
| #16 | feature/bypass-coverage | pull_request | OK | PR #5 v2: cobertura restaurada, 4/4 verde |
| #17 | main | push | OK | post-merge de PR #5 (`8e3958c`) |

Total de runs del repositorio: 17.

Cadena de `main` del día 2: `02188bf` (merge PR #4) -> `8e3958c` (merge PR #5).
Antes de este día: `fcb4eb6` (cierre del Día 1).

Commits de trabajo: `64bde70` (PR #4), `98f08f9` (PR #5 v1, el que rompe el
gate), `0e17b1a` (PR #5 v2, agrega los tests).

## Quality Gate: configuración verificada

Stack instalado (verificado contra `package.json`):

| paquete | versión |
|---|---|
| jest | 30.5.2 |
| ts-jest | 29.4.14 |
| @types/jest | 30.0.0 |
| supertest | 7.3.1 |
| @types/supertest | 7.2.1 |

`coverageThreshold.global` con `branches`, `functions`, `lines` y `statements` en 80
(las cuatro métricas, no solo líneas). En verde local, con 7 tests:

```
All files |   100 |    100 |     100 |   100 |
```

Artefacto: `actions/upload-artifact@v4`, nombre `code-coverage-report-node-20`,
`path: I-CAPACITACION/api-service/coverage/`, `retention-days: 7`, condicionado con
`if: matrix.node-version == '20.x'` para subirlo una sola vez.

## Branch Protection de `main` (4 checks requeridos)

Los 4 status checks exigidos, verificados contra la API:

| check requerido | app_id | app |
|---|---|---|
| `Code Quality & Typecheck` | 15368 | GitHub Actions |
| `Automated Tests (Node 18.x)` | 15368 | GitHub Actions |
| `Automated Tests (Node 20.x)` | 15368 | GitHub Actions |
| `Automated Tests (Node 22.x)` | 15368 | GitHub Actions |

Resto de la configuración: `strict: false`,
`required_approving_review_count: 0`, `enforce_admins: true`, force pushes
deshabilitados y borrado de la rama deshabilitado.

Los tres checks del matrix existen porque el `name:` del job es
`Automated Tests (Node ${{ matrix.node-version }})`: la matriz genera los tres
nombres solos, y Branch Protection los exige por nombre exacto.

## Checklist de evaluación de la guía (7 casillas)

| # | Casilla de la guía | Estado | Cómo quedó |
|---|---|---|---|
| 1 | Jest y Supertest configurados con `--detectOpenHandles` | OK | scripts `test` y `test:coverage` lo incluyen |
| 2 | Suites al 100% local y en los runners | OK | 7 tests, 100% en statements/branches/functions/lines |
| 3 | Matrix en Node 18.x, 20.x y 22.x en paralelo | OK | `fail-fast: false`, 3 checks generados |
| 4 | Quality Gate activo con umbral mínimo 80% verificado | OK | probado en rojo (run #15) y en verde (run #16) |
| 5 | Artefacto de cobertura (`coverage/`) descargable | OK | `code-coverage-report-node-20`, 17 KB, subido solo por Node 20, `retention-days: 7` |
| 6 | PR rechazado por falta de cobertura documentado | OK | PR #5, run #15, `mergeable_state: blocked` |
| 7 | Entrega formal con links y archivos en sus directorios exactos | OK | este checklist + bitácora + respuestas + loom en `dia2/` |
