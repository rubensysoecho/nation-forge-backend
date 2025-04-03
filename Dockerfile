FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

ENV NAME="Nation Forge API"
ENV VERSION="1.0.0"
ENV DESCRIPTION="API para la aplicación Nation Forge"

CMD ["node", "index.js"]