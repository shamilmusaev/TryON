# 🔧 Решение проблемы CORS

Replicate API не поддерживает прямые запросы из браузера по соображениям безопасности. Вот несколько решений:

## 🚀 Быстрое решение: Локальный Proxy Server

### Шаг 1: Установка зависимостей для proxy сервера
```bash
cd server
npm install
```

### Шаг 2: Запуск proxy сервера (в отдельном терминале)
```bash
cd server
npm start
```

Должно появиться:
```
🚀 Proxy server running on http://localhost:3001
📡 Proxying requests to Replicate API
```

### Шаг 3: Запуск React приложения (в основном терминале)
```bash
npm start
```

### ✅ Готово!
Теперь приложение будет работать с реальной генерацией через proxy сервер.

---

## 🌐 Альтернативные решения

### 1. Публичный CORS Proxy (менее надежно)
Раскомментируйте код в `src/services/corsProxy.js` и используйте:
- `https://api.allorigins.win/raw?url=`
- `https://cors-anywhere.herokuapp.com/`
- `https://corsproxy.io/?`

### 2. Netlify Functions (для продакшена)
Создайте serverless функции в `netlify/functions/`:

```javascript
// netlify/functions/replicate-proxy.js
exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': event.headers.authorization,
        'Content-Type': 'application/json',
      },
      body: event.body
    });
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
  }
};
```

### 3. Vercel API Routes (для продакшена)
Создайте файл `api/replicate.js`:

```javascript
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  }
}
```

---

## 🔍 Диагностика

### Проверка proxy сервера:
```bash
curl http://localhost:3001/health
```

Должен вернуть:
```json
{"status":"OK","timestamp":"2024-..."}
```

### Проверка React приложения:
Откройте Developer Tools → Console. Должны видеть:
```
📡 Using API endpoint: http://localhost:3001/api/replicate/predictions
🚀 Starting try-on generation...
```

---

## ⚠️ Важное

### Для разработки:
- ✅ Используйте локальный proxy (`localhost:3001`)
- ✅ API ключ уже встроен в код

### Для продакшена:
- 🔐 Переместите API ключ в переменные окружения
- 🌐 Используйте Netlify/Vercel Functions
- 🚫 **Никогда не выкладывайте API ключи в публичный код!**

---

## 🚀 Статус

- ✅ Proxy сервер создан
- ✅ ReplicateService обновлен
- ✅ Автоматическое переключение dev/prod
- ✅ Полезные сообщения об ошибках
- ✅ Health check endpoint

**Теперь генерация должна работать!** 🎉 