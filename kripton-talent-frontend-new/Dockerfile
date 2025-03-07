# Stage 1: Build
FROM node:18.15.0 as builder

# Check if Yarn is already installed
RUN which yarn || npm install -g yarn

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn run ng build --configuration=production

# Stage 2: Production
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/kripton_talent /usr/share/nginx/html

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
# FROM nginx:1.17.1-alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY /dist/kripton /usr/share/nginx/html