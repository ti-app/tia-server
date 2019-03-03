FROM node:8

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
ENV APP_BUILD_DATE=${BUILD_DATE} \
    DB_URI=${DB_URI} \
    DB_DB_NAME=${DB_DB_NAME} \
    DB_TREE_COLLECTION=${DB_TREE_COLLECTION} \
    TYPE=${TYPE} \
    PROJECT_ID=${PROJECT_ID} \
    PRIVATE_KEY_ID=${PRIVATE_KEY_ID} \
    PRIVATE_KEY=${PRIVATE_KEY} \
    CLIENT_EMAIL=${CLIENT_EMAIL} \
    CLIENT_ID=${CLIENT_ID} \
    AUTH_URI=${AUTH_URI} \
    TOKEN_URI=${TOKEN_URI} \
    AUTH_PROVIDER_X509_CERT_URL=${AUTH_PROVIDER_X509_CERT_URL} \
    CLIENT_X509_CERT_URL=${CLIENT_X509_CERT_URL} \
    DATABASE_URL=${DATABASE_URL} \
    SESSION_SECRET=${SESSION_SECRET}

RUN echo $APP_BUILD_DATE
# ADD init.sh .
# RUN chmod +x init.sh
# ENTRYPOINT ["./init.sh"]
# cmd to start service
CMD ["npm", "start"]