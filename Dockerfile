FROM node:22-alpine AS builder

WORKDIR /app

# Activamos corepack y fijamos pnpm 10.33.3
RUN corepack enable && corepack prepare pnpm@10.33.3 --activate

# Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalamos dependencias respetando lockfile
RUN pnpm install --frozen-lockfile

# Copiamos el resto del proyecto
COPY . .

# Build
RUN pnpm build


FROM socialengine/nginx-spa:latest

COPY --from=builder /app/dist /app

RUN chmod -R 755 /app