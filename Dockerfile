FROM oven/bun:1.1.29-alpine

RUN mkdir -p /app
WORKDIR /app

# Install required packages
RUN apk add --no-cache \
      ca-certificates \
      wget 

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nodejs \
      npm 

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_CACHE_DIR=/home/web/.cache

COPY package*.json ./
COPY . .

RUN bun install
RUN bun run build

CMD ["bun", "run", "start"]