FROM node:latest
LABEL Description="cis-ierarchy-app"

COPY . /home/node/app
COPY docker.env /home/node/app/.env

RUN cd /home/node/app && \
    npm install -g typescript && \
    rm -rf node_modules && \
    npm install && \
    npm run build 

EXPOSE 3000
WORKDIR /home/node/app
# В данном случае инициализация базы происходит перед запуском контейнера приложения.
# В идеале лучше эту операцию вынести в отдельный контейнер, который будет подготавливать базу перед запуском.
# 10 секунд чтобы дождаться пока docker-compose поднимет postgres
CMD ["/bin/bash", "-c", "sleep 10 && npm run migration:run && npm run start:prod"]
