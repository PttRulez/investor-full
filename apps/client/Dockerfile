FROM node:20-alpine
WORKDIR /next-app
ADD *.json .
RUN npm install
ADD . .
RUN npm run build
