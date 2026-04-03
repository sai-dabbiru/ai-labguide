FROM node:latest

WORKDIR /app

COPY . .

RUN npm run install:all

EXPOSE 5173

CMD ["npm","run","dev"]
