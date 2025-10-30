const requestCounts = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 10;
  
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

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return response.status(500).json({ 
      error: 'As variáveis de ambiente do Firebase não estão configuradas corretamente no Vercel.' 
    });
  }

  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  response.setHeader('Access-Control-Allow-Origin', 'https://cade-a-luz.vercel.app');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  
  response.status(200).json(firebaseConfig);
}
