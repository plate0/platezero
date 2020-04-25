FROM node:12.14.0-stretch

# replace this with your application's default port
EXPOSE 9100

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

# Bundle app source
COPY .babelrc .
COPY next-env.d.ts .
COPY next.config.js .
COPY tsconfig.server.json .
COPY tsconfig.json .
COPY routes.ts .
COPY pages pages
COPY server server
COPY common common
COPY components components
COPY models models
COPY static static
COPY style style
COPY context context
COPY hooks hooks

RUN yarn build

CMD [ "yarn", "start" ]
