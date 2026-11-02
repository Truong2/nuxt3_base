FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm@10.28.2
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
