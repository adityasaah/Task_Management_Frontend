FROM node:latest

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --include=dev


COPY . .

RUN pnpm build

RUN npm install -g serve


EXPOSE 3000

CMD ["serve", "-s", "dist"],