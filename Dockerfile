FROM --platform=linux/amd64 oven/bun:1

RUN apt-get update && apt-get install -y \
      chromium \
      ca-certificates \
      nodejs \
      npm \
      && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_CACHE_DIR=/home/web/.cache    

# Install Google Chrome Stable and dependencies
RUN apt-get update && apt-get install -y gnupg wget ca-certificates
RUN wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable --no-install-recommends
RUN   apt-get install -y \
libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgdk-pixbuf2.0-0 \
libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils && \
rm -rf /var/lib/apt/lists/*


RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
COPY . .

RUN bun install
RUN bun run build --sourcemap

CMD ["bun", "run", "start"]
# CMD ["bun", "dist/index.js"]