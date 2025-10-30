const requestCounts = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 15;
  
  const key = ip;
  const record = requestCounts.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }
  
  requestCounts.set(key, record);
  
  if (requestCounts.size > 1000) {
    const oldestTime = now - windowMs * 2;
    for (const [k, v] of requestCounts.entries()) {
      if (v.resetTime < oldestTime) requestCounts.delete(k);
    }
  }
  
  return record.count <= maxRequests;
}

export default function handler(request, response) {
  const ip = request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return response.status(429).json({ 
      error: 'Muitas requisições. Tente novamente em 1 minuto.' 
    });
  }

  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;

  if (!geoapifyApiKey) {
    return response.status(500).json({ error: 'Geoapify API Key não está configurada.' });
  }

  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  response.setHeader('Access-Control-Allow-Origin', 'https://cade-a-luz.vercel.app');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  response.status(200).json({ apiKey: geoapifyApiKey });
}
