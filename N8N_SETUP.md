# 🔧 Настройка n8n для TryOn AI

Этот проект использует **n8n** вместо традиционного бэкэнда для проксирования запросов к Replicate API.

## 📋 Что нужно

1. **n8n на VPS** (уже установлен на `http://89.117.63.81`)
2. **Токен Replicate API** 
3. **Два workflow в n8n**

---

## 🚀 Шаг 1: Настройка Workflow в n8n

### Workflow 1: "Replicate Proxy" (создание предсказаний)

1. **Откройте n8n**: `http://89.117.63.81/home/workflows`
2. **Создайте новый workflow**: "+ New Workflow"
3. **Добавьте узлы в таком порядке:**

#### Узел 1: Webhook
- **HTTP Method**: `POST`
- **Path**: `replicate`
- **Authentication**: `None`
- **Respond**: `When Last Node Finishes`

#### Узел 2: HTTP Request (к Replicate API)
- **Method**: `POST`
- **URL**: `https://api.replicate.com/v1/predictions`
- **Authentication**: `None`
- **Send Headers**: ✅ включить
- **Headers**:
  ```
  Name: Authorization
  Value: Token ВАШ_REPLICATE_ТОКЕН_ЗДЕСЬ
  
  Name: Content-Type  
  Value: application/json
  ```
- **Send Body**: ✅ включить
- **Body Content Type**: `JSON`
- **Body**:
  ```json
  {
    "version": "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
    "input": {
      "human_img": "{{ $json.body.human_img }}",
      "garm_img": "{{ $json.body.garm_img }}",
      "garment_des": "{{ $json.body.garment_des }}"
    }
  }
  ```

#### Узел 3: Respond to Webhook
- **Respond With**: `JSON`
- **Response Body**: `{{ $json }}`

4. **Соедините узлы**: Webhook → HTTP Request → Respond to Webhook
5. **Сохраните workflow**: Ctrl+S
6. **Активируйте workflow**: переключатель "Active"

---

### Workflow 2: "Replicate Status" (проверка статуса)

1. **Создайте второй workflow**: "+ New Workflow"
2. **Добавьте узлы:**

#### Узел 1: Webhook  
- **HTTP Method**: `GET`
- **Path**: `replicate-status`
- **Authentication**: `None`
- **Respond**: `When Last Node Finishes`

#### Узел 2: HTTP Request
- **Method**: `GET`
- **URL**: `https://api.replicate.com/v1/predictions/{{ $json.query.id }}`
- **Headers**: тот же Authorization токен
- **Body**: не нужен для GET

#### Узел 3: Respond to Webhook
- **Respond With**: `JSON`
- **Response Body**: `{{ $json }}`

3. **Соедините, сохраните и активируйте**

---

## 🔑 Шаг 2: Получение токена Replicate

1. Зайдите на https://replicate.com
2. Войдите в аккаунт
3. Перейдите в **Account Settings** → **API Tokens**
4. Скопируйте токен (начинается с `r8_`)
5. Вставьте в HTTP Request узлы

---

## 🧪 Шаг 3: Тестирование

### Тест через curl:
```bash
# Создание предсказания
curl -X POST http://89.117.63.81/webhook/replicate \
  -H "Content-Type: application/json" \
  -d '{
    "human_img": "data:image/jpeg;base64,test",
    "garm_img": "data:image/jpeg;base64,test",
    "garment_des": "тестовая одежда"
  }'

# Проверка статуса (замените ID_ПРЕДСКАЗАНИЯ)
curl "http://89.117.63.81/webhook/replicate-status?id=ID_ПРЕДСКАЗАНИЯ"
```

---

## ⚙️ Настройки n8n на VPS

Убедитесь что n8n запущен с правильными настройками:

```bash
# На VPS
N8N_HOST=0.0.0.0 N8N_PORT=5678 n8n start
```

### Важные настройки:
- **Host**: `0.0.0.0` (не localhost!)
- **Port**: открыт в файрволе
- **CORS**: разрешен для вашего домена

---

## 🐛 Решение проблем

### "Workflow could not be started!"
- ✅ Проверьте что workflow активирован
- ✅ Проверьте токен Replicate (должен начинаться с `r8_`)
- ✅ Убедитесь что все узлы соединены правильно

### "Connection refused"  
- ✅ Проверьте что n8n запущен на VPS
- ✅ Проверьте порт 5678 в файрволе
- ✅ Попробуйте добавить порт в URL: `http://89.117.63.81:5678/webhook/replicate`

### "500 Internal Server Error"
- ✅ Проверьте логи n8n на VPS
- ✅ Проверьте формат Body в HTTP Request узле
- ✅ Убедитесь что токен Replicate валидный

---

## 📱 React приложение

React приложение уже настроено для работы с n8n:
- **URL**: `http://89.117.63.81/webhook/replicate`
- **Status URL**: `http://89.117.63.81/webhook/replicate-status`

Никаких дополнительных изменений в коде не требуется!

---

## 🎯 Преимущества n8n

✅ **Нет кода** - только визуальные блоки  
✅ **Автоматическое масштабирование**  
✅ **Встроенное логирование**  
✅ **Простое добавление новых API**  
✅ **Графический интерфейс для отладки**  

---

## 🆘 Нужна помощь?

1. **Проверьте workflow активирован** ли в n8n
2. **Скопируйте точный URL** из Webhook узла  
3. **Убедитесь что токен Replicate правильный**
4. **Протестируйте через curl** перед использованием в приложении 