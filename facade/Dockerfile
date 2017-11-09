FROM node:latest

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# add environment variables
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ADD ./package.json /usr/src/app/package.json
RUN npm install

ADD ./src /usr/src/app/src 
RUN echo $NODE_ENV

CMD ["node", "/usr/src/app/index.js"]
