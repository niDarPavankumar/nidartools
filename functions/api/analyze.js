export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const { request, env } = context;
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Resume and Job Description are required." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is missing in Cloudflare environment variables." }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const promptText = `
You are an expert ATS Resume Analyzer.
Analyze the following Resume against the Job Description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Respond strictly in raw valid JSON format without any markdown code block formatting (do not wrap in \`\`\`json).
JSON Structure:
{
  "atsScore": 85,
  "matchingKeywords": ["HTML5", "CSS3", "JavaScript"],
  "missingKeywords": ["React.js", "REST API"],
  "formattingFeedback": ["Clear structure", "Good section headers"],
  "actionableSuggestions": ["Add React projects", "Highlight API work"]
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return new Response(JSON.stringify({ error: geminiData.error?.message || "Gemini API Error" }), {
        status: geminiResponse.status,
        headers: corsHeaders
      });
    }

    let rawText = geminiData.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    const parsedData = JSON.parse(rawText);

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error: " + err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
