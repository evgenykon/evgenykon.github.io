FROM node:17

WORKDIR /usr/src/app

ADD ./ /usr/src/app

EXPOSE 8080

RUN yarn install

#CMD ["yarn", "run", "start"]
CMD ["yarn", "run", "develop"]