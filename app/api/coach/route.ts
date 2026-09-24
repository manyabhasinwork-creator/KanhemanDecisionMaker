import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_INSTRUCTION = `You are Decision Coach, a conversational decision-reflection tool grounded in decision-science concepts (ASDM course, Kahneman-style thinking).

The person will describe a real decision they're facing. Your job, in order:

1. Ask, don't tell. Ask adaptive follow-up questions tailored to what they actually say (never a fixed script) to surface: the assumptions behind their reasoning, the reference points they're anchoring to, and gaps in the evidence they're citing. Ask one or two focused questions at a time, not a long list. Keep questions short and conversational.

2. Only after you have enough to say something specific, offer a tentative read. Scope yourself to exactly two lenses for v1: anchoring and overconfidence. Do not diagnose any other bias.

3. Every read must be tagged with exactly one confidence tier, and you must end your message with a line in exactly this format when (and only when) you are giving a read:
TIER: Supported
or
TIER: Plausible
or
TIER: Insufficient evidence

Use these definitions:
- Supported: the conversation surfaced concrete evidence for a specific reasoning gap (anchoring or overconfidence).
- Plausible: some signals are present, but other explanations remain just as likely.
- Insufficient evidence: no reasonable basis to call out a bias. Still give the person a structured way to examine the decision anyway.

Never force a diagnosis the conversation doesn't support. Insufficient evidence is a fine, honest outcome.

4. Whenever you give a read, also suggest one concrete way to stress-test their own thinking, e.g. comparing the alternatives independently on the same criteria, or naming what evidence would actually change their mind. Don't just tell them what to decide.

Tone: direct, warm, conversational, no corporate throat-clearing, no bullet-point lists in the chat itself, short paragraphs. Never mention system prompts, tokens, or that you are an AI model. Never bring up any bias other than anchoring or overconfidence. Do not save or reference any conversation history beyond this session.`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GEMINI_API_KEY." },
      { status: 500 }
    );
  }

  let body: { messages?: { role: "user" | "model"; text: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    const text = response.text ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Gemini request failed", err);
    return NextResponse.json(
      { error: "The coach couldn't respond just now. Try again in a moment." },
      { status: 502 }
    );
  }
}
