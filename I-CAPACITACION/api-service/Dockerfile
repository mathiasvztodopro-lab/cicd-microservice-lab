# ==========================================
# Etapa 1: Dependencias y Compilacion (Builder)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Se copian SOLO los manifiestos y se corre `npm ci` ANTES de copiar src/.
# STOP1 de la guia: si se invirtiera el orden, cada cambio de una linea en
# src/ invalidaria esta capa y Docker volveria a descargar todos los paquetes
# de npm en cada build. Asi el cache de dependencias sobrevive a los cambios
# de codigo, que son los frecuentes.
COPY package*.json tsconfig.json ./

# Instalacion completa: aqui vive typescript, que es quien compila en el paso
# siguiente. Solo se usa en esta etapa.
RUN npm ci

# Codigo fuente
COPY src/ ./src/

# TypeScript -> JavaScript nativo en dist/
RUN npm run build

# ==========================================
# Etapa 2: Imagen Final de Produccion (Runner)
# ==========================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /usr/src/app

# Solo dependencias de produccion (express y dotenv). typescript, jest,
# eslint, ts-node y los @types NO llegan a la imagen final.
# Desviacion de la guia: el material usa `npm ci --only=production`, que esta
# deprecado en npm 10/11; `--omit=dev` es el equivalente vigente.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Unicamente el codigo transpilado, tomado de la etapa builder.
COPY --from=builder /usr/src/app/dist ./dist

# Seguridad: ejecutar como usuario no privilegiado (node) en vez de root.
# Si un atacante compromete la app, no obtiene root en el host.
USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]