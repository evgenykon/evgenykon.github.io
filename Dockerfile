FROM node:17

WORKDIR /usr/src/app

EXPOSE 8080

#CMD ["yarn", "run", "start"]
CMD ["yarn", "run", "develop"]