# 1. Базовый образ
FROM node:20-alpine AS builder
WORKDIR /app

# 2. Копируем package.json и package-lock.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# 3. Копируем весь исходный код (включая prisma/schema.prisma)
COPY . .

# 4. Генерация Prisma клиента
RUN npx prisma generate

# 5. Генерация ts-proto файлов
RUN npx protoc \
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=./ \
    --ts_proto_opt=nestJs=true,addGrpcMetadata=true,outputServices=grpc-js \
    src/proto/*.proto

# 6. Сборка TypeScript
RUN npm run build


# 7. Runtime образ
FROM node:20-alpine
WORKDIR /app

# Копируем node_modules и dist из builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Копируем proto и prisma
COPY --from=builder /app/src/proto ./src/proto
COPY --from=builder /app/prisma ./prisma

# Порты
EXPOSE 3000
EXPOSE 50051

# Запуск
CMD npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/src/main.js
