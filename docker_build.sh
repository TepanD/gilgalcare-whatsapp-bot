#!/bin/bash
# Read the GOOGLE_PRIVATE_KEY from the .env.production file
GOOGLE_PROJECT_ID=$(grep -E '^GOOGLE_PROJECT_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_PRIVATE_KEY_ID=$(grep -E '^GOOGLE_PRIVATE_KEY_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_PRIVATE_KEY=$(grep -E '^GOOGLE_PRIVATE_KEY=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_SERVICE_ACCOUNT_EMAIL=$(grep -E '^GOOGLE_SERVICE_ACCOUNT_EMAIL=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_CLIENT_ID=$(grep -E '^GOOGLE_CLIENT_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_AUTH_URI=$(grep -E '^GOOGLE_AUTH_URI=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_TOKEN_URI=$(grep -E '^GOOGLE_TOKEN_URI=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_AUTH_PROVIDER=$(grep -E '^GOOGLE_AUTH_PROVIDER=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_CLIENT_CERT_URL=$(grep -E '^GOOGLE_CLIENT_CERT_URL=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')
GOOGLE_SHEETS_ID=$(grep -E '^GOOGLE_SHEETS_ID=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')

# Ensure proper escaping of special characters (newlines, spaces) by preserving quotes
GOOGLE_PRIVATE_KEY_ESCAPED=$(printf "%s" "$GOOGLE_PRIVATE_KEY" | sed -e 's/"/\\"/g')
GOOGLE_PROJECT_ID_ESCAPED=$(printf "%s" "$GOOGLE_PROJECT_ID" | sed -e 's/"/\\"/g')
GOOGLE_SERVICE_ACCOUNT_EMAIL_ESCAPED=$(printf "%s" "$GOOGLE_SERVICE_ACCOUNT_EMAIL" | sed -e 's/"/\\"/g')
GOOGLE_CLIENT_CERT_URL_ESCAPED=$(printf "%s" "$GOOGLE_CLIENT_CERT_URL" | sed -e 's/"/\\"/g')
GOOGLE_SHEETS_ID_ESCAPED=$(printf "%s" "$GOOGLE_SHEETS_ID" | sed -e 's/"/\\"/g')

app_version=$(grep '"version":' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')

docker build\
 --build-arg GOOGLE_PROJECT_ID='$GOOGLE_PROJECT_ID_ESCAPED'\
 --build-arg GOOGLE_PRIVATE_KEY_ID='$GOOGLE_PRIVATE_KEY_ID'\
 --build-arg GOOGLE_PRIVATE_KEY='$GOOGLE_PRIVATE_KEY_ESCAPED'\
 --build-arg GOOGLE_SERVICE_ACCOUNT_EMAIL='$GOOGLE_SERVICE_ACCOUNT_EMAIL_ESCAPED'\
 --build-arg GOOGLE_CLIENT_ID='$GOOGLE_CLIENT_ID'\
 --build-arg GOOGLE_AUTH_URI='$GOOGLE_AUTH_URI'\
 --build-arg GOOGLE_TOKEN_URI='$GOOGLE_TOKEN_URI'\
 --build-arg GOOGLE_AUTH_PROVIDER='$GOOGLE_AUTH_PROVIDER'\
 --build-arg GOOGLE_CLIENT_CERT_URL='$GOOGLE_CLIENT_CERT_URL_ESCAPED'\
 --build-arg GOOGLE_SHEETS_ID='$GOOGLE_SHEETS_ID_ESCAPED'\
 --build-arg GOOGLE_SHEET_NAME=$(grep -E '^GOOGLE_SHEET_NAME=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg ADMIN_WA_NUMBER="\"$(grep -E '^ADMIN_WA_NUMBER=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\""\
 --build-arg WHATSAPP_GROUP_NAME=$(grep -E '^WHATSAPP_GROUP_NAME=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --build-arg DB_FILE_NAME=$(grep -E '^DB_FILE_NAME=' .env.production | sed -E 's/^.*="?([^"]*)"?/\1/')\
 --no-cache -t tepand/gilgalunicare-wa:$app_version .