FROM node:18.12.0-alpine3.16

WORKDIR /app

COPY package*.json ./ 

RUN yarn

COPY . .

RUN npx tsc

EXPOSE 5001

CMD ["node", "app.js"]
