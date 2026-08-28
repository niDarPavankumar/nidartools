export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Resume content and Job Description are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key environment variable is missing." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const promptText = `
You are an expert Applicant Tracking System (ATS) and Senior Technical Recruiter.
Analyze the following Resume against the Job Description.

Resume Content:
${resumeText}

Job Description:
${jobDescription}

Provide a detailed JSON response strictly with the following keys (do not include markdown codeblocks or extra text):
{
  "atsScore": number (0-100),
  "matchingKeywords": [array of string],
  "missingKeywords": [array of string],
  "formattingFeedback": [array of string],
  "actionableSuggestions": [array of string]
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
      return new Response(JSON.stringify({ error: geminiData.error?.message || "Error calling Gemini API" }), {
        status: geminiResponse.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    let rawOutput = geminiData.candidates[0].content.parts[0].text;
    rawOutput = rawOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedResult = JSON.parse(rawOutput);

    return new Response(JSON.stringify(parsedResult), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
