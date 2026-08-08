FROM node:24-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.16.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.29-alpine

ENV API_URL=http://localhost:8003

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/runtime-config.template.js /opt/frontend/runtime-config.template.js
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1

CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /opt/frontend/runtime-config.template.js > /tmp/runtime-config.js && exec nginx -g 'daemon off;'"]
