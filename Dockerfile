FROM node:alpine

WORKDIR /app

COPY . .

RUN npm run install:all

EXPOSE 8080

CMD ["npm","run","dev"]
