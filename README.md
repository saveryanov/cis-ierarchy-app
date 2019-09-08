# CIS Ierarchy App

Приложение для построения структуры организации.

Используемый стек: NestJS + GraphQL + TypeORM + Postgres

## Запуск через docker-compose

Для запуска выполнить команду:

```bash
docker-compose up -d
```

В результате будет запущен контейнер с базой данных и контейнер с приложением. API будет доступно по адресу http://localhost:3000/graphql.

## Установка и запуск без Docker

### Установка приложения

```bash
npm install
```

### Подготовка базы данных

Создать базу данны для приложения, инициализировать таблицы и связи:

```bash
sudo -u postgres psql -c "CREATE DATABASE cis_db;"
npm run migration:run
```

### Конфигурация

Параметры подключения к базе данных (логин, пароль, название базы данных) находятся в файле .env.

### Запуск

```bash
npm run start
```

### Тестирование

```bash
npm run test:e2e
```
