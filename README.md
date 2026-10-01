# cicd-microservice-lab — CI/CD Sprint 1

Laboratorio de inducción a CI/CD. Dia 1 de 7: microservicio base + primer
workflow de GitHub Actions.

## Estructura

```
.
├── .github/workflows/ci.yml            ← primer workflow (raíz del repo)
└── I-CAPACITACION/
    ├── api-service/
    │   ├── src/index.ts                ← Express: /health y /api/v1/info
    │   ├── test/                       ← vacío hasta el Día 2
    │   ├── eslint.config.js
    │   ├── tsconfig.json
    │   └── package.json
    ├── checklists/CICD-D1/rp-software1/checklist.md
    └── entregables/cicd-sprint/dia1/
        ├── bitacora_rp-software1.txt
        ├── respuestas_dia1_rp-software1.txt
        └── loom.txt
```

## Comandos

```bash
cd I-CAPACITACION/api-service

npm ci          # instalación determinista (la que usa CI)
npm run lint    # ESLint
npm run build   # tsc -> dist/
npm test        # placeholder hasta el Día 2
npm run dev     # nodemon en modo desarrollo
```

Endpoints: `GET /health` y `GET /api/v1/info` en `http://localhost:3000`.

## Pipeline

`Code Quality & Typecheck` corre en cada push y PR contra `main` y `develop`:
checkout → Node 20 con cache de npm → `npm ci` → `npm run lint` → `npm run build`.
Permisos del `GITHUB_TOKEN`: `contents: read`.

## Notas de implementación

- `typescript` pineado en `^5.9.3`: `typescript-eslint@8` exige `>=4.8.4 <6.1.0`,
  y `typescript@7` rompe la instalación por peer dependency.
- ESLint 10 solo soporta flat config, por eso la configuración vive en
  `eslint.config.js` y no en `.eslintrc.json`.
- El workflow está en la raíz del repo porque sus pasos usan
  `working-directory: I-CAPACITACION/api-service`; GitHub Actions ignora
  workflows anidados.
- `cache-dependency-path` y `working-directory` apuntan a
  `I-CAPACITACION/api-service/...`: con `api-service/...` a secas la primera
  ejecución falla en el setup de Node con "Some specified paths were not
  resolved, unable to cache dependencies".