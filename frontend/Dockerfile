FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
ARG CONFIGURATION=production
RUN npm run build -- --configuration=${CONFIGURATION}

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]