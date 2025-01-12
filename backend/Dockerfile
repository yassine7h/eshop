FROM node:20

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "run", "start:dev", "--", "--host"]
