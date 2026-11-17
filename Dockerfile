FROM node:22-alpine

WORKDIR /app

# dependencies first for layer caching
COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev"]
