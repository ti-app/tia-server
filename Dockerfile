FROM node:8

# ARG APP_BUILD_DATE
# ARG NODE_ENV
# ARG DB_URI
# ARG DB_NAME
# ARG TYPE
# ARG PROJECT_ID
# ARG PRIVATE_KEY_ID
# ARG PRIVATE_KEY
# ARG CLIENT_EMAIL
# ARG CLIENT_ID
# ARG AUTH_URI
# ARG TOKEN_URI
# ARG AUTH_PROVIDER_X509_CERT_URL
# ARG CLIENT_X509_CERT_URL
# ARG DATABASE_URL
# ARG SESSION_SECRET
# ARG BUCKET_ID

ENV PORT 8000

EXPOSE 8000

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

ADD package.json  /app/

RUN npm install -g pm2
RUN npm install

COPY . /app/
RUN touch .env
RUN npm build
# ENV APP_BUILD_DATE=${BUILD_DATE} \
#   AUTH_PROVIDER_X509_CERT_URL=$AUTH_PROVIDER_X509_CERT_URL \
#   AUTH_URI=$AUTH_URI \
#   BUCKET_ID=$BUCKET_ID \
#   CLIENT_EMAIL=$CLIENT_EMAIL \
#   CLIENT_ID=$CLIENT_ID \
#   CLIENT_X509_CERT_URL=$CLIENT_X509_CERT_URL \
#   DATABASE_URL=$DATABASE_URL \
#   DB_NAME=$DB_NAME \
#   DB_URI=$DB_URI \
#   NODE_ENV=$NODE_ENV \
#   PRIVATE_KEY=$PRIVATE_KEY \
#   PRIVATE_KEY_ID=$PRIVATE_KEY_ID \
#   PROJECT_ID=$PROJECT_ID \
#   SESSION_SECRET=$SESSION_SECRET \
#   TOKEN_URI=$TOKEN_URI \
#   TYPE=$TYPE

# ADD init.sh .
# RUN chmod +x init.sh
# ENTRYPOINT ["./init.sh"]
# cmd to start service
CMD ["npm", "start:prod"]
