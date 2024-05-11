## Используемые технологии

-   NestJS
-   PostgreSQL
-   TypeORM
-   Docker

## Установка приложения

Создаем .env файл с содержимым .env.template

```bash
$ npm i

$ docker compose up -d

$ npm run start

```

## Реализованы методы

-   GET /find - поиск по id и/или slug, исп. query параметры
-   POST /create - создание категорий
-   GET /search - фильтр, исп. query параметры
-   PUT /:id - обновление категории
-   PATCH /:id/update-slug - обновление slug
-   PATCH /:id/update-name - обновление name
-   PATCH /:id/update-description - обновление description
-   PATCH /:id/update-active - обновление active
-   DELETE /:id - удаление категории по id
