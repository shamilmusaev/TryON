// CORS Proxy для обхода ограничений браузера
class CorsProxyService {
  constructor() {
    // Используем общедоступный CORS proxy (не для продакшена!)
    this.proxyUrl = 'https://api.allorigins.win/raw?url=';
    // Альтернативы:
    // this.proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // this.proxyUrl = 'https://corsproxy.io/?';
  }

  // Обертка для fetch с CORS proxy
  async proxyFetch(url, options = {}) {
    const proxiedUrl = this.proxyUrl + encodeURIComponent(url);
    
    // Для POST запросов нужно специальная обработка
    if (options.method === 'POST') {
      return this.handlePostRequest(url, options);
    }
    
    return fetch(proxiedUrl, {
      ...options,
      headers: {
        ...options.headers,
        // Убираем некоторые заголовки которые могут вызвать проблемы
        'Origin': undefined,
        'Referer': undefined
      }
    });
  }

  // Специальная обработка POST запросов
  async handlePostRequest(url, options) {
    // Используем allorigins для POST запросов
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    
    try {
      const response = await fetch(proxyUrl + encodeURIComponent(url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'POST',
          headers: options.headers,
          body: options.body
        })
      });
      
      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.warn('CORS proxy failed, falling back to direct request');
      // Fallback к прямому запросу (может не работать)
      return fetch(url, options);
    }
  }
}

export const corsProxy = new CorsProxyService();
export default corsProxy; 