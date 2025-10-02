// api/geoapify-key.js

export default function handler(request, response) {
  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;

  if (!geoapifyApiKey) {
    return response.status(500).json({ error: 'Geoapify API Key não está configurada.' });
  }

  response.status(200).json({ apiKey: geoapifyApiKey });
}
