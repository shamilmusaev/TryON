# 🎨 TryOn AI - Примерка одежды с ИИ

> **Инновационное React приложение для виртуальной примерки одежды с использованием ИИ**

![TryOn AI Preview](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop)

## ✨ Возможности

- 🤖 **ИИ-генерация** - Продвинутые алгоритмы для реалистичной примерки
- 📱 **Адаптивный дизайн** - Идеально работает на всех устройствах  
- 🎯 **Простой интерфейс** - Интуитивно понятный процесс загрузки и примерки
- ⚡ **Быстрая обработка** - Результат за 30-60 секунд
- 🖼️ **Множественные варианты** - Генерация нескольких стилей
- 📸 **Поддержка камеры** - Съемка фото прямо в приложении

## 🏗️ Архитектура

```
Frontend (React) → n8n Workflow → Replicate API → ИИ Модель
```

### Технологии:
- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Автоматизация**: n8n (no-code backend)  
- **ИИ**: Replicate API с моделью виртуальной примерки
- **Хостинг**: Любой статический хостинг (Vercel, Netlify, GitHub Pages)

---

## 🚀 Быстрый старт

### 1. Клонирование проекта
```bash
git clone https://github.com/your-username/tryon-ai.git
cd tryon-ai
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка n8n
Следуйте инструкции в файле [N8N_SETUP.md](./N8N_SETUP.md)

### 4. Запуск приложения
```bash
npm start
```

Приложение откроется на `http://localhost:3000`

---

## ⚙️ Настройка

### Настройка n8n webhook URL
В файле `src/services/replicate.js` измените URL на ваш n8n:

```javascript
const N8N_BASE_URL = 'http://ваш-n8n-сервер.com/webhook';
```

### Получение токена Replicate API
1. Зарегистрируйтесь на [replicate.com](https://replicate.com)
2. Получите API токен в настройках аккаунта
3. Добавьте токен в ваш n8n workflow

---

## 📱 Использование

### Шаг 1: Загрузка фото
- Сделайте фото себя или загрузите из галереи
- Убедитесь что человек хорошо виден на фото

### Шаг 2: Выбор одежды  
- Загрузите фото одежды которую хотите примерить
- Лучше всего работает с одеждой на чистом фоне

### Шаг 3: Генерация
- Добавьте описание одежды (опционально)
- Нажмите "Создать примерку"
- Дождитесь результата (30-60 секунд)

### Шаг 4: Результат
- Просмотрите сгенерированное изображение
- Сохраните или поделитесь результатом

---

## 🛠️ Разработка

### Структура проекта
```
tryon-ai/
├── public/              # Статические файлы
├── src/
│   ├── components/      # React компоненты
│   ├── services/        # API сервисы (n8n интеграция)
│   ├── hooks/          # Кастомные React хуки
│   ├── types/          # TypeScript типы
│   └── utils/          # Утилиты
├── N8N_SETUP.md        # Инструкция по настройке n8n
└── README.md           # Этот файл
```

### Основные компоненты:
- `OnboardingPage` - Стартовая страница
- `UploadPage` - Загрузка изображений  
- `ProcessingPage` - Экран обработки
- `ResultPage` - Показ результатов

### API интеграция:
- `src/services/replicate.js` - Интеграция с n8n webhook
- Автоматическое отслеживание прогресса
- Обработка ошибок и повторные попытки

---

## 🎯 n8n Workflow

Приложение использует **n8n** для бэкэнд автоматизации:

### Преимущества n8n:
✅ **Без кода** - визуальная настройка  
✅ **Легкое масштабирование**  
✅ **Встроенный мониторинг**  
✅ **Простая отладка**  
✅ **Быстрое добавление новых API**

### Workflow включает:
1. **Webhook** для приема запросов
2. **HTTP Request** к Replicate API  
3. **Обработка ответов** и возврат результата

Подробная настройка в [N8N_SETUP.md](./N8N_SETUP.md)

---

## 🚀 Деплой

### Статический хостинг (рекомендуется)
```bash
# Сборка
npm run build

# Деплой в любой статический хостинг:
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod --dir=build  
# - GitHub Pages: через GitHub Actions
```

### Важно:
- Убедитесь что n8n доступен с вашего домена
- Настройте CORS в n8n для фронтэнда
- Проверьте токен Replicate API

---

## 🐛 Решение проблем

### Ошибки подключения
- ✅ Проверьте что n8n workflow активирован
- ✅ Убедитесь что URL n8n правильный
- ✅ Проверьте токен Replicate API

### Медленная генерация
- ⏱️ Обычное время: 30-60 секунд
- 🖼️ Оптимизируйте размер изображений
- 🔄 Проверьте стабильность интернета

### Плохое качество результата
- 📸 Используйте четкие фото без размытия
- 🎯 Человек должен быть хорошо виден
- 👕 Одежда на чистом фоне работает лучше

---

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/new-feature`
3. Сделайте коммит: `git commit -m 'Add new feature'`
4. Пусните изменения: `git push origin feature/new-feature`  
5. Создайте Pull Request

---

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

---

## 🔗 Полезные ссылки

- [Replicate API Docs](https://replicate.com/docs)
- [n8n Documentation](https://docs.n8n.io/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [N8N_SETUP.md](./N8N_SETUP.md) для настройки
2. Создайте Issue в GitHub
3. Присоединитесь к обсуждениям

---

**Создано с ❤️ для сообщества разработчиков** 