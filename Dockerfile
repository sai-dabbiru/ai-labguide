FROM node:alpine

WORKDIR /app

COPY . .

RUN npm run install:all

EXPOSE 80

CMD ["npm","run","dev"]
