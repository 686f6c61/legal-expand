# Landing de legal-expand: sitio estatico Astro servido por nginx.
FROM node:22-alpine AS build
WORKDIR /app/landing

# El proxy del BOE/EUR-Lex se sirve en el mismo dominio (ver nginx.conf), asi que
# la demo apunta al propio origen. Astro inlinea las PUBLIC_ en tiempo de build.
ENV PUBLIC_BOE_PROXY=https://legal-expand.686f6c61.dev

# Instala dependencias con el lockfile para builds reproducibles.
COPY landing/package.json landing/package-lock.json ./
RUN npm ci

# Copia el resto del sitio y genera la salida estatica en dist/.
COPY landing/ ./
# Fija la variable en un .env para que Astro/Vite la inlinee con seguridad.
RUN printf 'PUBLIC_BOE_PROXY=%s\n' "$PUBLIC_BOE_PROXY" > .env
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/landing/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
