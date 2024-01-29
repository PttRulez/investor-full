FROM node:20-alpine
WORKDIR /nest-app
ADD *.json .
RUN npm install
ADD . .
RUN npm run build
CMD ["node", "./apps/server/dist/main.js"]
