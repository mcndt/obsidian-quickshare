FROM node:16-alpine AS BUILD_IMAGE


# install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy all local files into the image.
COPY . .

RUN npx prisma generate

RUN npm run build

# remove development dependencies
RUN npm prune --production

FROM node:16-alpine

WORKDIR /app
COPY --from=0 /app .

ENV PORT 8080
EXPOSE 8080

CMD ["node", "./build/server.js"]