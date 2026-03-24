import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create prompt for the AI
  const lastMessage = messages[messages.length - 1].text;
  const prompt = `
You are a tutor. Do NOT give direct answers.
Guide the student to think critically by asking questions, giving hints, or suggesting strategies.
Student: ${lastMessage}
AI:
`;

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 150,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.text?.trim() || "Sorry, I didn't understand.";

  return NextResponse.json({ text });
}