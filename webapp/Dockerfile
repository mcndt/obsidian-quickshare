FROM node:16-alpine AS BUILD_IMAGE


# install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy all local files into the image.
COPY . .

ENV VITE_SERVER_INTERNAL="http://server:8080"
ENV VITE_BRANDING="Noteshare.space"

RUN npm run build

# remove development dependencies
RUN npm prune --production

FROM node:16-alpine

WORKDIR /app
COPY --from=BUILD_IMAGE /app .

EXPOSE 3000
CMD ["node", "./build"]