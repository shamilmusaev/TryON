# Настройка локальной разработки

## 1. Установка зависимостей

```bash
npm install
```

## 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым:

```
REPLICATE_API_TOKEN=ваш_токен_replicate
```

Получить токен можно на https://replicate.com/account/api-tokens

## 3. Запуск proxy-server

```bash
node server/proxy-server.js
```

## 4. Запуск React приложения

```bash
npm start
```

## 5. Тестирование

- Откройте http://localhost:3000
- Proxy-server будет работать на http://localhost:3002
- Загрузите фото человека и одежды для тестирования AI try-on

## Безопасность

- ❌ НИКОГДА не коммитьте API ключи в git
- ✅ Используйте только переменные окружения
- ✅ Файл `.env` уже добавлен в `.gitignore 