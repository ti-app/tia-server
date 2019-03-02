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

# ADD init.sh .
# RUN chmod +x init.sh
# ENTRYPOINT ["./init.sh"]
# cmd to start service
CMD ["pm2-runtime", "start", "processes.json"]