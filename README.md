# Frontend частина додатку

Це фронтенд частина веб-додатку, написана на React (TypeScript).

## Технології

- React
- TypeScript
- CSS / SCSS (або styled-components)
- React Router

## Встановлення

1. Клонуйте репозиторій:

```bash
git clone <URL вашого репозиторію>
```

2. Перейдіть у папку з фронтендом:

```bash
cd frontend
```

3. Встановіть залежності:

```bash
npm install
# або
yarn install
```

## Запуск локально

Для запуску проекту у режимі розробки:

```bash
npm start
# або
yarn start
```

Після цього відкрийте у браузері [http://localhost:5173](http://localhost:5173)

## Білд (підготовка до деплою)

Щоб зібрати проект для продакшену:

```bash
npm run build
# або
yarn build
```

Результат буде у папці `build/`.

## Структура проекту

- `/src` — основний код React
- `/public` — статичні файли (індекс HTML, favicon тощо)
- `/src/components` — React компоненти
- `/src/pages` — сторінки додатку
- `/src/styles` — стилі

## Налаштування середовища

Створіть файл `.env` у корені фронтенду, наприклад:

```env
VITE_API_BASE_URL = (Посилання на ваш бекенд)
```
