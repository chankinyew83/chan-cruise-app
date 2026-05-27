export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({
    error: 'GEMINI_API_KEY not configured — add it in Vercel project settings'
  });

  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

  const sysPrompt = `You are a cruise intelligence analyst for Disney Adventure cruise from Singapore.
Extract specific actionable factual claims from the passenger report.
Return a JSON array ONLY. No prose. No markdown fences. No explanation.

Each item: {"t":"title 5-8 words","tx":"1-2 sentences present tense specific","conf":"high|medium|low","category":"environment|rides|shows|dining|logistics|characters|navigation|facilities","tags":["tag"]}

Rules:
- Extract ONLY from the provided text. No invention.
- Skip vague opinions — specific verifiable facts only.
- Return [] if no specific facts found.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sysPrompt }] },
        contents: [{ role: 'user', parts: [{ text: text.trim() }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return res.status(502).json({ error: `Gemini error: ${err}` });
  }

  const geminiData = await response.json();
  const extractedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

  // Return in Anthropic-compatible format so the app frontend needs no changes
  return res.status(200).json({
    content: [{ type: 'text', text: extractedText }]
  });
}
