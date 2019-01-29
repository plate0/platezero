FROM node:11.8.0-stretch

# replace this with your application's default port
EXPOSE 9100

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn

# Bundle app source
COPY next.config.js .
COPY tsconfig.server.json .
COPY tsconfig.json .
COPY pages pages
COPY server server

RUN yarn build

CMD [ "yarn", "start" ]
