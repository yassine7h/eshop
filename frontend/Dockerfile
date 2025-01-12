FROM node:20

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force

RUN npm install --platform=linux --arch=x64

COPY . .

ENV PORT=5173

EXPOSE $PORT

CMD ["npm", "run", "dev","--", "--host"]
