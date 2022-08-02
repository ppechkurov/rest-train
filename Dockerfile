FROM node:latest
WORKDIR /app
RUN ls -a
COPY package.json /app
COPY package-lock.json /app
COPY .env /app
COPY dist /app/dist
RUN cd /app
RUN ls -a
RUN npm install

CMD [ "npm","start" ]
