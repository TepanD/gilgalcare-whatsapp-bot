ARG NODE_VERSION=22
FROM node:$NODE_VERSION-alpine AS node
FROM oven/bun:1.1.29-alpine

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

ARG GOOGLE_PROJECT_ID
ARG GOOGLE_PRIVATE_KEY_ID
ARG GOOGLE_PRIVATE_KEY
ARG GOOGLE_SERVICE_ACCOUNT_EMAIL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_AUTH_URI
ARG GOOGLE_TOKEN_URI
ARG GOOGLE_AUTH_PROVIDER
ARG GOOGLE_CLIENT_CERT_URL
ARG GOOGLE_SHEETS_ID
ARG GOOGLE_SHEET_NAME
ARG WHATSAPP_GROUP_NAME
ARG ADMIN_WA_NUMBER
ARG DB_FILE_NAME

# Use the arguments as environment variables
ENV GOOGLE_PROJECT_ID=$GOOGLE_PROJECT_ID
ENV GOOGLE_PRIVATE_KEY_ID=$GOOGLE_PRIVATE_KEY_ID
ENV GOOGLE_PRIVATE_KEY=$GOOGLE_PRIVATE_KEY
ENV GOOGLE_SERVICE_ACCOUNT_EMAIL=$GOOGLE_SERVICE_ACCOUNT_EMAIL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_AUTH_URI=$GOOGLE_AUTH_URI
ENV GOOGLE_TOKEN_URI=$GOOGLE_TOKEN_URI
ENV GOOGLE_AUTH_PROVIDER=$GOOGLE_AUTH_PROVIDER
ENV GOOGLE_CLIENT_CERT_URL=$GOOGLE_CLIENT_CERT_URL
ENV GOOGLE_SHEETS_ID=$GOOGLE_SHEETS_ID
ENV GOOGLE_SHEET_NAME=$GOOGLE_SHEET_NAME
ENV WHATSAPP_GROUP_NAME=$WHATSAPP_GROUP_NAME
ENV ADMIN_WA_NUMBER=$ADMIN_WA_NUMBER
ENV DB_FILE_NAME=$DB_FILE_NAME

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