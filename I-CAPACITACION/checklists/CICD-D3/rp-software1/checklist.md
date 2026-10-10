CHECKLIST DE VERIFICACIÓN - DÍA 3
Curso: CICD
Integrante: rp-software1

Bloque A: Dockerfile Multi-Stage + .dockerignore
[x] Dockerfile creado en I-CAPACITACION/api-service/Dockerfile
[x] .dockerignore creado en I-CAPACITACION/api-service/.dockerignore
[x] Etapa builder: node:20-alpine, npm ci, npm run build
[x] Justificación de 'copiar package*.json antes de src' registrada
[x] Etapa runner: node:20-alpine, npm ci --omit=dev, COPY --from=builder dist, USER node, EXPOSE 3000, CMD ["node","dist/index.js"]
