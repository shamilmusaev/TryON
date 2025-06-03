# 🚀 Настройка Netlify Functions для TryOn AI

## 📋 Что нужно сделать для деплоя:

### 1. **Добавить переменную среды в Netlify:**

В панели управления Netlify:
- Перейдите в **Site settings** → **Environment variables**
- Добавьте переменную:
  ```
  REPLICATE_API_TOKEN = ваш_ключ_от_replicate
  ```

### 2. **Подключить Git репозиторий:**
- Push этот код в GitHub/GitLab
- Подключите репозиторий к Netlify
- Netlify автоматически развернет сайт

### 3. **Проверить деплой:**
- Netlify автоматически создаст Netlify Functions
- Функции будут доступны по адресам:
  - `/.netlify/functions/replicate` (создание try-on)
  - `/.netlify/functions/replicate-status` (получение статуса)

## 🔧 Как это работает:

### **В локальной разработке:**
- Использует proxy-server на `localhost:3002`
- Запуск: `node server/proxy-server.js`

### **В продакшене (Netlify):**
- Использует Netlify Functions
- Никакого дополнительного сервера не нужно!

## 📁 Файлы:

- `netlify/functions/replicate.js` - создание try-on генерации
- `netlify/functions/replicate-status.js` - получение статуса генерации  
- `src/services/replicate.js` - клиентский сервис
- `netlify.toml` - конфигурация Netlify

## ✅ Преимущества:

- ✅ Никакого отдельного сервера
- ✅ Автоматический деплой с сайтом
- ✅ Безопасное хранение API ключей
- ✅ Встроенная поддержка CORS
- ✅ Бесплатно до 125,000 запросов/месяц

## 🎯 Готово к деплою!

Просто push в Git и подключите к Netlify! 