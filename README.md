# CIS Ierarchy App

Приложение для построения структуры организации.

Используемый стек: NestJS + GraphQL + TypeORM + Postgres

## Запуск через docker-compose

Для запуска выполнить команду:

```bash
docker-compose up -d
```

В результате будет запущен контейнер с базой данных и контейнер с приложением. Graphql playground будет доступен по адресу http://localhost:3000/graphql.

Если потребуется, параметры подключения к базе данных (логин, пароль, название базы данных), которые используются в контейнере, находятся в файле docker.env.

## Установка и запуск без Docker

### Установка приложения

```bash
npm install
```

### Конфигурация

Параметры подключения к базе данных (логин, пароль, название базы данных) находятся в файле .env.

### Подготовка базы данных

Создать базу данны для приложения, инициализировать таблицы и связи:

```bash
sudo -u postgres psql -c "CREATE DATABASE cis_db;"
npm run migration:run
```

### Запуск

```bash
npm run start
```

### Тестирование

```bash
npm run test:e2e
```

## Использование

Демо версия приложения развернута по адресу <http://cis.obaka.ru:3000/graphql>.

### Queries

* user(id: ID!): User - получение информации о сотруднике

* getUsers: [User] - получение информации о всех сотрудниках

* department(id: ID!): Department - получение информации о направлении в компании

* getTopDepartments: [Department] - получение списка направлений в компании, которые являются корневыми (от этих узлов следует начинать построение дерева)

* getChildren(id: ID!): [Department] - получение списка направлений в компании, которые являются дочерними для направления с указанным id

* getDanglingDepartments: [Department] - получение списка направлений в компании, которые не являются корневыми, но у которых нет родителя. Служит для обеспечения возможности привязать отвязанные направления к новому родителю. Они могут возникнуть, если удалить узел дерева, у которого имеются дочерние узлы.

### Mutations

* createDepartment(department: DepartmentInput): Department - создание направления (корневые узлы isRoot = true, дочерние должны иметь parentId)

* updateDepartment(id: ID!, department: DepartmentInput): Department - изменение направления

* deleteDepartment(id: ID!): Boolean - удаление направления

* createUser(user: UserInput): User - создание сотрудника

* updateUser(id: ID!, user: UserInput): User - изменение сотрудника

* deleteUser(id: ID!): Boolean - удаление сотрудника

### Построение дерева

Для построения дерева можно использовать несколько подходов:

1. С помощью одного запроса **getDepartments**:

Получить все узлы и построить дерево на фронтенде:

```graphql
query getAll{
    getDepartments {
        id,
        name,
        parentId,
        headRoleName,
        user { name, surname, avatarUrl },
        directChildrenCount,
        totalChildrenCount
    }
}
```

2. Через один запрос **department** с ограниченной глубиной вложенности.

Для начала получить информацию о корневом узле дерева с помощью запроса getTopDepartments, а затем выполнить запрос:

```graphql
query getTree{
    department(id:1), {
        id,
        name,
        headRoleName,
        user { name, surname, avatarUrl },
        directChildrenCount,
        totalChildrenCount,
        children {
            id,
            name,
            headRoleName,
            user { name, surname, avatarUrl },
            directChildrenCount,
            totalChildrenCount,
            children {
                id,
                name,
                headRoleName,
                user { name, surname, avatarUrl },
                directChildrenCount,
                totalChildrenCount,
                children {
                    id,
                    name,
                    headRoleName,
                    user { name, surname, avatarUrl },
                    directChildrenCount,
                    totalChildrenCount
                }
            }
        }
    }
}
```

Минус такого подхода в том, что при таком запросе будет выполнено большое количество запросов к базе.

3. С помощью нескольких запросов **getChildren**

Для начала получить информацию о корневом узле дерева с помощью запроса getTopDepartments. Затем рекурсивно для всех направлений, у которых directChildrenCount не равен нулю, выполнить запрос на получение дочерних узлов:

```graphql
query getChildrenDepartments{
    getChildren(id:1), {
        id,
        name,
        headRoleName,
        user { name, surname, avatarUrl },
        directChildrenCount,
        totalChildrenCount
    }
}
```

В таком случае будет выполнено большое количество запросов, однако этот метод походит в случае если дерево требуется строить по частям. Например, если все узлы по умолчанию свернуты и пользователь кликает на кнопку "развернуть", то так можно запрашивать только те данные, которые будут отображены на экране.
