---
alumno: rp-software1
curso: CICD
dia: 1
estado: en_progreso
loom: (agregar link al terminar)
url_repo: https://github.com/rp-software1/cicd-microservice-lab
---

## Secciones

- [x] A — Inicialización del proyecto api-service + TypeScript + Linter
- [x] B — Anatomía de GitHub Actions: Creación de .github/workflows/ci.yml
- [ ] C — Triggers, Checkout, Node Setup y Caching de Dependencias
- [ ] D — Consultoría arquitectónica con IA (Claude / ChatGPT)
- [ ] E — Auto-Auditoría de Pipeline y Verificación de Branch Protection
- [ ] F — Bitácora de cierre individual

## Notas de implementación

El material original propone `.eslintrc.json`, pero ESLint 10 solo soporta
"flat config", asi que la configuracion equivalente vive en
`I-CAPACITACION/api-service/eslint.config.js`.

El workflow `ci.yml` esta en la raiz del repositorio y no dentro de
`api-service/`: sus pasos usan `working-directory: api-service` y
`cache-dependency-path: api-service/package-lock.json`, rutas que solo resuelven
desde la raiz. Ademas GitHub Actions solo lee workflows ubicados en
`.github/workflows/` en la raiz.

`typescript` quedo pineado en `^5.9.3` porque `typescript-eslint@8` exige la
rama `>=4.8.4 <6.1.0`; con `typescript@7` la instalacion falla por peer
dependency y `npm ci` no llega a ejecutarse en el runner.

## Ticks pendientes

- [ ] Ejecucion en verde vista en la pestaña Actions
- [ ] Branch Protection en `main` exigiendo el check `Code Quality & Typecheck`
- [ ] PR con error de tipado intencional bloqueado (Bloque E)