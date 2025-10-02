// api/firebase-config.js

export default function handler(request, response) {
  // Lê as variáveis de ambiente do Firebase que você configurou no Vercel
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  // Verifica se todas as chaves estão presentes
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return response.status(500).json({ error: 'As variáveis de ambiente do Firebase não estão configuradas corretamente no Vercel.' });
  }

  // Envia a configuração como resposta
  response.status(200).json(firebaseConfig);
}
