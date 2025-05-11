FROM node:24-alpine AS builder
WORKDIR /app

# Кэшируем зависимости
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Копируем исходники и билдим
COPY . .
RUN npm run build

# Этап продакшен-образа
FROM nginx:stable-alpine AS production

# Настраиваем пользовательские конфиги
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем статику
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
