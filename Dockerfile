FROM node:latest

WORKDIR /app
RUN mkdir drive
VOLUME /app/drive

RUN npm install pm2 -g
RUN npm install -g pnpm

COPY package*.json .
RUN pnpm install

COPY src src
COPY ecosystem.config.js .
COPY nest-cli.json .
COPY tsconfig.json .

RUN pnpm run build

RUN rm -rf src
RUN rm -rf tsconfig.json
RUN rm nest-cli.json

EXPOSE 3000/TCP

CMD pm2 start ecosystem.config.js && pm2 monit
