FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

EXPOSE 3000

CMD ["pnpm", "run", "dev", "--", "--hostname", "0.0.0.0"]
