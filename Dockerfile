FROM node:16.15.0-slim
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY .next/. /app/.next/
EXPOSE 80
CMD ["npm", "start"]