#!/bin/bash
# Read the GOOGLE_PRIVATE_KEY from the .env.production file
GOOGLE_PRIVATE_KEY=$(grep -E '^GOOGLE_PRIVATE_KEY=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')

# Ensure proper escaping of special characters (newlines, spaces) by preserving quotes
GOOGLE_PRIVATE_KEY_ESCAPED=$(printf "%s" "$GOOGLE_PRIVATE_KEY" | sed -e 's/"/\\"/g')

docker build\
 --build-arg GOOGLE_PROJECT_ID=$(grep -E '^GOOGLE_PROJECT_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_PRIVATE_KEY_ID=$(grep -E '^GOOGLE_PRIVATE_KEY_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_PRIVATE_KEY=\"$GOOGLE_PRIVATE_KEY_ESCAPED\"\
 --build-arg GOOGLE_SERVICE_ACCOUNT_EMAIL=$(grep -E '^GOOGLE_SERVICE_ACCOUNT_EMAIL=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_CLIENT_ID=$(grep -E '^GOOGLE_CLIENT_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_AUTH_URI=$(grep -E '^GOOGLE_AUTH_URI=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_TOKEN_URI=$(grep -E '^GOOGLE_TOKEN_URI=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_AUTH_PROVIDER=$(grep -E '^GOOGLE_AUTH_PROVIDER=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_CLIENT_CERT_URL=$(grep -E '^GOOGLE_CLIENT_CERT_URL=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_SHEETS_ID=$(grep -E '^GOOGLE_SHEETS_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg GOOGLE_SHEET_NAME=$(grep -E '^GOOGLE_SHEET_NAME=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg ADMIN_WA_NUMBER=\"$(grep -E '^ADMIN_WA_NUMBER=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\"\
 --build-arg WHATSAPP_GROUP_NAME=$(grep -E '^WHATSAPP_GROUP_NAME=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg DB_FILE_NAME=$(grep -E '^DB_FILE_NAME=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --no-cache -t tepand/gilgalunicare-wa:0.2.3 .