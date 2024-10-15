ARG NODE_VERSION=22
FROM node:$NODE_VERSION-alpine AS node
FROM oven/bun:1.1.29-alpine

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN mkdir -p /app
WORKDIR /app

# Install required packages & chromium
RUN apk add --no-cache \
      ca-certificates \
      wget \
      chromium \
      npm 

RUN node -v

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_CACHE_DIR=/home/web/.cache

RUN npm install -g rimraf
COPY package*.json ./
COPY . .
RUN bun run clean:all

# Build project
RUN bun install
RUN bun run build

CMD ["bun", "run", "start"]