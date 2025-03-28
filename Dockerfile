# Stage 1: Build the app
FROM node:20 AS build

WORKDIR /app

COPY ./package*.json ./

RUN yarn install

COPY . .

RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/ .

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]