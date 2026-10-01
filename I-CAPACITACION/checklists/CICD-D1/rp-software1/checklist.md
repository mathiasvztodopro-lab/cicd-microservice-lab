---
alumno: rp-software1
curso: CICD
dia: 1
estado: dia_1_completo
loom: (agregar link al terminar)
url_repo: https://github.com/mathiasvztodopro-lab/cicd-microservice-lab (privado)
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

- [x] Ejecucion en verde vista en la pestaña Actions (run #2, #5, #6)
- [x] PR con error de tipado intencional bloqueado (Bloque E): PR #1, run #4 en
      rojo con `error TS2322`, corregido y mergeado en `a38be25`
- [ ] Branch Protection en `main` exigiendo el check `Code Quality & Typecheck`

## Ejecuciones de la pipeline (evidencia del dia 1)

| run# | rama | evento | resultado | detalle |
|------|------|--------|-----------|---------|
| #1 | main | push | FALLA | paths del cache sin resolver |
| #2 | main | push | OK | primera ejecucion completa en verde |
| #3 | feature/dia1-demo-error-de-tipos | pull_request | FALLA | ESLint: variable sin usar |
| #4 | feature/dia1-demo-error-de-tipos | pull_request | FALLA | `error TS2322` en tsc |
| #5 | feature/dia1-demo-error-de-tipos | pull_request | OK | error corregido |
| #6 | main | push | OK | cache hit, 9 MB restaurados |

## Bloque C: Branch Protection

La API respondio `403`:

  "Upgrade to GitHub Pro or make this repository public to enable this feature."

GitHub no habilita branch protection en repos privados del plan gratuito, asi
que queda pendiente de una decision del alumno: pagar Pro o hacer el repo
publico. El repo sigue privado a proposito. La pipeline funciona igual sin esto
(el gate detecta el error en rojo), pero `main` no queda bloqueada contra
pushes directos.