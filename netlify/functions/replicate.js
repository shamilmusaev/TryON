exports.handler = async (event, context) => {
  // Разрешаем только POST запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Обрабатываем CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  try {
    // Проверяем наличие API ключа
    const apiToken = process.env.REPLICATE_API_TOKEN;
    console.log('🔑 API Token available:', !!apiToken);
    console.log('🔑 API Token prefix:', apiToken ? apiToken.substring(0, 8) + '...' : 'undefined');
    
    if (!apiToken) {
      console.error('❌ REPLICATE_API_TOKEN is not set');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'API token not configured'
        })
      };
    }

    const body = JSON.parse(event.body);
    console.log('📤 Request body keys:', Object.keys(body));
    
    // Создаем prediction в Replicate
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        input: {
          human_img: body.human_img,
          garm_img: body.garm_img,
          garment_des: body.garment_des || "clothing item"
        }
      })
    });

    console.log('📡 Replicate response status:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Replicate API error:', data);
    } else {
      console.log('✅ Prediction created:', data.id);
    }

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('❌ Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}; 