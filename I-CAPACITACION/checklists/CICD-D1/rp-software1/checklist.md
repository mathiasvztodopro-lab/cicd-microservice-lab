---
alumno: rp-software1
curso: CICD
dia: 1
estado: dia_1_completo
loom: (agregar link al terminar)
url_repo: https://github.com/mathiasvztodopro-lab/cicd-microservice-lab (publico)
---

## Secciones

- [x] A — Inicialización del proyecto api-service + TypeScript + Linter
- [x] B — Anatomía de GitHub Actions: Creación de .github/workflows/ci.yml
- [x] C — Triggers, Checkout, Node Setup y Caching de Dependencias
- [ ] D — Consultoría arquitectónica con IA (Claude / ChatGPT)
- [x] E — Auto-Auditoría de Pipeline y Verificación de Branch Protection
- [x] F — Bitácora de cierre individual

## Notas de implementación

El material original propone `.eslintrc.json`, pero ESLint 10 solo soporta
"flat config", asi que la configuracion equivalente vive en
`I-CAPACITACION/api-service/eslint.config.js`.

Verificado por ejecucion (archivo sonda con violaciones a proposito):
- `@typescript-eslint/no-explicit-any` -> error
- `@typescript-eslint/no-unused-vars` -> error en variable local sin usar
- `argsIgnorePattern: '^_'` -> un parametro `_ignorado` NO se reporta
- `no-console: 'off'` -> un `console.log` NO se reporta

Es decir: las 3 reglas propias y los 2 presets (`eslint:recommended` +
`plugin:@typescript-eslint/recommended`, ahora dentro de
`tseslint.configs.recommended`) estan activos y cumplen. Lo unico que cambia
es el nombre del archivo, porque el formato viejo fue removido de la
herramienta. Un `.eslintrc.json` en la raiz del paquete quedaria como
configuracion muerta: ESLint 10 no lo lee.

`.gitignore` esta con las 5 lineas exactas del material
(`node_modules/`, `dist/`, `coverage/`, `.env`, `*.log`).

Los 6 scripts del material estan presentes con los mismos nombres. Dos
diferencias de valor, ambas a proposito:
- `lint` / `lint:fix` usan `eslint src` y no `eslint src/**/*.ts`. Ver hallazgo
  #6: la version del material tiene un agujero silencioso en el runner Linux.
- `test` usa `node -e "..."` en vez de `echo "..." && exit 0`: imprime el mismo
  mensaje y devuelve exit 0, pero funciona igual en Windows y en Linux.

El workflow `ci.yml` esta en la raiz del repositorio y no dentro de
`api-service/`: sus pasos usan `working-directory: I-CAPACITACION/api-service` y
`cache-dependency-path: I-CAPACITACION/api-service/package-lock.json`, rutas que
solo resuelven desde la raiz. Ademas GitHub Actions solo lee workflows ubicados
en `.github/workflows/` en la raiz.

Con los paths que trae el material original (`api-service/...`) la primera
ejecucion fallo en `Setup Node.js runtime environment` con
"Some specified paths were not resolved, unable to cache dependencies": el
microservicio vive un nivel mas abajo, dentro de `I-CAPACITACION/`.

`typescript` quedo pineado en `^5.9.3` porque `typescript-eslint@8` exige la
rama `>=4.8.4 <6.1.0`; con `typescript@7` la instalacion falla por peer
dependency y `npm ci` no llega a ejecutarse en el runner.

## Ticks pendientes

- [x] Ejecucion en verde vista en la pestaña Actions (runs #2, #5, #6, #7, #8)
- [x] PR con error de tipado intencional bloqueado (Bloque E): PR #1, run #4 en
      rojo con `error TS2322`, corregido y mergeado en `a38be25`
- [x] Branch Protection en `main` con las 4 casillas del 6.3.3

## Ejecuciones de la pipeline (evidencia del dia 1)

| run# | rama | evento | resultado | detalle |
|------|------|--------|-----------|---------|
| #1 | main | push | FALLA | paths del cache sin resolver |
| #2 | main | push | OK | primera ejecucion completa en verde |
| #3 | feature/dia1-demo-error-de-tipos | pull_request | FALLA | ESLint: variable sin usar |
| #4 | feature/dia1-demo-error-de-tipos | pull_request | FALLA | `error TS2322` en tsc |
| #5 | feature/dia1-demo-error-de-tipos | pull_request | OK | error corregido |
| #6 | main | push | OK | cache hit, 9 MB restaurados |
| #7 | main | push | OK | bitacora con evidencia real |
| #8 | main | push | OK | hallazgo del glob documentado |

## Bloque C — 6.3.3: Branch Protection (COMPLETO)

El 6.3.1 del material pide un repositorio **publico**, y eso importa: GitHub no
habilita Branch Protection en repos privados del plan gratuito. Con el repo en
privado la API devolvia `403 - "Upgrade to GitHub Pro or make this repository
public to enable this feature"`. Al pasar el repo a publico, la regla se creo
sin costo, tal como pide la guia.

Las 4 casillas del material, verificadas contra la API:

| Casilla del material | Estado | Como quedo |
|---|---|---|
| Require a pull request before merging | OK | `required_approving_review_count: 0` |
| Require status checks to pass before merging | OK | check requerido: `Code Quality & Typecheck` |
| (check seleccionado) | OK | coincide exacto con el `name:` del job en `ci.yml` |
| Do not allow bypassing the above settings | OK | `enforce_admins: true` |

No se marco "Require branches to be up to date" porque el material no lo pide.

Prueba funcional: un `git push` directo a `main` fue rechazado por la regla
(`protected branch hook declined`), y los cambios de documentacion tuvieron que
entrar por PR. Eso demuestra que la regla es vinculante y no un adorno.