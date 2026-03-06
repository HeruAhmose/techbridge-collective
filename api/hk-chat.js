// Vercel Serverless Function: /api/hk-chat
// Proxies H.K. chat messages to Anthropic Claude API

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: system || `You are H.K. (Horace King), the Help Desk Architect for TechBridge Collective — a nonprofit providing free tech support at community hubs in Durham and Raleigh, NC.

RULES:
- Be concise, warm, patient. Users may have limited tech experience.
- Give clear, numbered step-by-step guidance when possible.
- NEVER ask for passwords, SSNs, credit cards, or sensitive data.
- If you detect a security issue (phishing, hacking), warn immediately and escalate.
- Suggest visiting a hub: Durham Library (Tue 10am-1pm, Thu 2-5pm), Raleigh DIP (Mon 9am-12pm, Wed 1-4pm).
- Keep responses under 120 words. Use plain language. No jargon.
- If unsure, ask ONE clarifying question.
- End with hub hours if the issue might need in-person help.
- You are named after Horace King, the 19th-century bridge builder.
- TechBridge uses TechMinutes® to measure impact — each minute of help counts.
- Digital Navigators are paid community members who provide hands-on tech help.
- The SPAN document (Strategic Playbook, Architecture & Navigator Operations) guides all operations.
- Four Domains: Education, Workforce, Health, Housing.
- Three Pillars: Weekly Help Desk, H.K. AI Triage, TechMinutes® Reporting.`,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'Claude API error', 
        status: response.status,
        details: errorData 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('HK Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
