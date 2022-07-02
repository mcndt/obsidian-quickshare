FROM node:16-alpine AS BUILD_IMAGE

ARG VITE_SERVER_INTERNAL $VITE_SERVER_INTERNAL
ARG VITE_BRANDING $VITE_BRANDING

# install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy all local files into the image.
COPY . .

RUN npm run build

# remove development dependencies
RUN npm prune --production

FROM node:16-alpine

WORKDIR /app
COPY --from=BUILD_IMAGE /app .

EXPOSE 3000
CMD ["node", "./build"]