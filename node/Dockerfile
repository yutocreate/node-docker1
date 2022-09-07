FROM node:alpine

WORKDIR /usr/app

COPY ./app/package.json ./
COPY ./app ./
RUN npm install

CMD ["npm", "start"]