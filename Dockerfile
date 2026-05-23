FROM node:22-alpine

WORKDIR /app

# Upgrade npm to fix known CVEs in bundled npm version
RUN npm install -g npm@latest

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "index.js"]