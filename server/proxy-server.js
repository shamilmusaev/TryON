const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3002;

// Разрешаем CORS для всех запросов
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Получаем API ключ из переменных окружения
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN не установлен!');
  console.log('💡 Создайте файл .env с содержимым:');
  console.log('REPLICATE_API_TOKEN=ваш_токен_здесь');
  process.exit(1);
}

// Proxy endpoint для Replicate API - упрощенный путь
app.post('/api/replicate', async (req, res) => {
  try {
    console.log('🔄 Proxying request to Replicate API...');
    console.log('📤 Request body keys:', Object.keys(req.body));
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        input: {
          human_img: req.body.human_img,
          garm_img: req.body.garm_img,
          garment_des: req.body.garment_des || "clothing item"
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Replicate API error:', data);
      return res.status(response.status).json(data);
    }

    console.log('✅ Prediction created:', data.id);
    res.json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy server error', message: error.message });
  }
});

// Оригинальный endpoint тоже оставляю для совместимости
app.post('/api/replicate/predictions', async (req, res) => {
  try {
    console.log('🔄 Proxying request to Replicate API...');
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Replicate API error:', data);
      return res.status(response.status).json(data);
    }

    console.log('✅ Prediction created:', data.id);
    res.json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy server error' });
  }
});

// GET endpoint для проверки статуса - упрощенный путь
app.get('/api/replicate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Getting prediction status:', id);
    
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Replicate status error:', data);
      return res.status(response.status).json(data);
    }

    console.log('📊 Status for', id, ':', data.status);
    res.json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy server error', message: error.message });
  }
});

// GET endpoint для проверки статуса - оригинальный путь
app.get('/api/replicate/predictions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to Replicate API`);
  console.log(`🔗 Use http://localhost:${PORT}/api/replicate for POST requests`);
});

module.exports = app; 