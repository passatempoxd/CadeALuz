// inject-env.mjs
import fs from 'fs';

const filePath = './index.html';

console.log('Injetando variáveis de ambiente...');

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Lista de variáveis de ambiente que você configurou na Vercel
  const envVars = {
    '__FIREBASE_API_KEY__': process.env.FIREBASE_API_KEY,
    '__FIREBASE_AUTH_DOMAIN__': process.env.FIREBASE_AUTH_DOMAIN,
    '__FIREBASE_PROJECT_ID__': process.env.FIREBASE_PROJECT_ID,
    '__FIREBASE_STORAGE_BUCKET__': process.env.FIREBASE_STORAGE_BUCKET,
    '__FIREBASE_MESSAGING_SENDER_ID__': process.env.FIREBASE_MESSAGING_SENDER_ID,
    '__FIREBASE_APP_ID__': process.env.FIREBASE_APP_ID,
  };

  for (const [key, value] of Object.entries(envVars)) {
    if (!value) {
      console.warn(`Atenção: A variável de ambiente para '${key}' não está definida.`);
      continue;
    }
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  }

  fs.writeFileSync(filePath, content);
  console.log('Variáveis de ambiente injetadas com sucesso em index.html!');

} catch (error) {
  console.error('Falha ao injetar variáveis de ambiente:', error);
  process.exit(1); // Encerra o build com erro
}
