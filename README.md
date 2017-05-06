# team4. "Фотоквест"

## Сайт: http://super-photo-quest.herokuapp.com
## Workflow

### 1. Подготовка к разработке
1. Делаем fork.
2. Клонируем с удаленного репозитория к себе ( `git clone https://github.com/<nick-name>/team4` )
3. Подтягиваем изменения из мастера ( `git remote add upstream https://github.com/urfu-2016/team4` )

### 2. Начало работы над задачей
1. Проверяем что мы находимся в мастере ( `git checkout master` )
2. Подтягиваем изменения ( `git pull upstream master` )
3. Создаем ветку, указываем название задачи, которую делаем ( `git checkout -b <name-task>` )

### 3. Работа над задачей
1. Добавляем измененные файлы к себе в ветку ( `git add <changed-file>` )
2. Добавляем комментарий ( `git commit -m "Осмысленный коммент"` )

### 4. Создание пулла с решением
1. Проверяем что мы в созданной ветке а не в мастере ( `git checkout <name-task>` )
2. Подтягиваем изменения ( `git pull upstream --rebase master` )
3. Решаем конфликты и добавляем измененные файлы ( `git add <conflict-file>` )
4. git rebase --continue
5. Пушим! ( `git push origin <name-task>` )

### 5. Ревью и обновление пулла
1. ( `git checkout <name-task>` )
2. ( `git add <changed-file` )
3. ( `git commit -m "Осмысленный коммент"` )
4. ( `git pull upstream --rebase master` )
5. ( `git push -f origin <name-task>` )

### 6. Слияние пулла с основной веткой
1. ( `git checkout <name-task>` )
2. ( `git pull upstream --rebase master` )
3. ( `git push -f origin <name-task>` )
4. В интерфейсе на гитхабе делаем pull request с созданной ветки

# Запуск проекта
1. Устанавливаем зависимости ( `npm install` )
2. Устанавливаем сборщик проекта gulp ( `npm install gulp -g` )
3. Собираем и запускаем проект ( `gulp` ) (но для этого вам понадобится логин и пароль от бд)

# Стек технологий
1. Платформа - Node.js
2. Сервер - Express.js
3. Шаблоны - Handlebars
4. БД - mongodb
5. Деплой - Heroku
6. Continues Integration – Travis
7. Сборщик проекта - Gulp
8. Сервис хранения фотографий - Cloudinary

# Директории

## 1. src
### В ней пишем код, для каждой компоненты в blocks есть свои .hbs,.less и (если требуется)js файлы.
### В js текущий блок можно получить в свойстве block
### Структура папок:
```
`-- src
    +-- apps
    |   +-- app
    |   |   +-- controllers.js
    |   |   `-- routes.js
    |   +-- auth
    |   |   +-- controllers.js
    |   |   `-- routes.js
    |   +-- profile
    |   |   +-- controllers.js
    |   |   `-- routes.js
    |   `-- quests
    |       +-- controllers.js
    |       `-- routes.js
    +-- blocks
    |   +-- layouts
    |   +-- general
    |   `-- ...
    +-- middlewares
    |   +-- auth.js
    |   `-- middlewares.js
    +-- models
    |   +-- photo.js
    |   +-- quest.js
    |   `-- user.js
    +-- tests
    |   `-- ...
    +-- tools
    |	  +-- cloudinary.js
    |   `-- query-parser.js
    `-- view_models
        +-- filter.js
        `-- quest-filter.js

```
  
## 2. build
### Каждый .hbs компонент в папке src/blocks/<название partial> оборачивается
```html
<div class='<название partial>'>
```
### .less файл будет скомпилирован в css(папка build/public) и перед всеми правилами установится нужный селектор нашего partial
### Таким образом можно less файлы радом с partials писать так:
```
& {
    ....
}

a {
	...
}

&:hover {
	...
}
```
### Т.е к верхним скобочкам добавится нужный нам селектор
### layout файлы так не будут обрабатываться и в src/layouts не должны лежать стили
### Структура папок:
```
`-- build
    +-- controllers
    |   +-- middlewares
    |   |   `-- auth.js
    |   +-- cloudinary.js
    |	+-- middlewares.js
    |   +-- query-parser.js
    |   +-- quests.js
    |   `-- routes.js
    +-- hbs
    |   `-- ...
    +-- layouts
    |   `-- main.hbs
    +-- models
    |   +-- photo.js
    |   +-- quest.js
    |   `-- user.js
    +-- public
    |   +-- img
    |   |   `-- ...
    |   +-- js
    |   |   +-- polyfills.js
    |   |   +-- globals.js
    |   |   `-- ...
    |   `-- css
    |		`-- all.css
    `-- view_models
        +-- filter.js
        `-- quest-filter.js
```
