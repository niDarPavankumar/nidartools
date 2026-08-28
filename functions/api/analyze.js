export async function onRequestPost(context) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    const { request, env } = context;
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), { status: 400, headers });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key missing in environment." }), { status: 500, headers });
    }

    const promptText = `
You are an expert ATS Resume Analyzer. Compare this Resume and Job Description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Respond strictly in valid JSON without markdown codeblocks or backticks:
{
  "atsScore": 85,
  "matchingKeywords": ["HTML5", "CSS3", "JavaScript"],
  "missingKeywords": ["React.js", "REST API"],
  "formattingFeedback": ["Clear sections", "Good layout"],
  "actionableSuggestions": ["Add React skills", "Include metrics"]
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Gemini API Error" }), { status: 500, headers });
    }

    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    const jsonOutput = JSON.parse(text);

    return new Response(JSON.stringify(jsonOutput), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Exception: " + err.message }), { status: 500, headers });
  }
}
