export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set in Vercel environment variables' });

  // Handle body whether parsed or raw string
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const text = body?.text;
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

  const sysPrompt = `You are a cruise intelligence analyst for Disney Adventure cruise from Singapore.
Extract specific actionable factual claims from the passenger report.
Return a JSON array ONLY. No prose. No markdown fences. No explanation.

Each item: {"t":"title 5-8 words","tx":"1-2 sentences present tense specific","conf":"high|medium|low","category":"environment|rides|shows|dining|logistics|characters|navigation|facilities","tags":["tag"]}

Rules: Extract ONLY from provided text. No invention. Skip vague opinions. Return [] if no specific facts found.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sysPrompt }] },
          contents: [{ role: 'user', parts: [{ text: text.trim() }] }],
          generationConfig: { maxOutputTokens: 1000, responseMimeType: 'application/json' },
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(502).json({
        error: `Gemini API error ${geminiRes.status}: ${geminiData?.error?.message || JSON.stringify(geminiData)}`
      });
    }

    const extractedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    // Return in Anthropic-compatible format — no frontend changes needed
    return res.status(200).json({
      content: [{ type: 'text', text: extractedText }]
    });

  } catch (e) {
    return res.status(500).json({ error: `Function error: ${e.message}` });
  }
}
