// API route for generating chat suggestions
import { type NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const ChatStarter = z.object({
  starters: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const { actions } = await req.json();

    const prompt = `
You are an imaginative assistant. Based on the following list of actions, generate four unique, interesting, and engaging chat starter prompts for an AI model to respond to. Each prompt should be distinct and designed to spark interesting conversations or responses.

Actions:
${JSON.stringify(actions, null, 2)}

Format your response as a JSON array of four strings, each being a different chat starter prompt, with no extra explanations.
    `;

    const response = await openai.responses.parse({
      model: 'o3-mini',
      input: [{ role: 'user', content: prompt }],
      text: {
        format: zodTextFormat(ChatStarter, 'chat_starters'),
      },
    });

    console.log('OpenAI Response:', response);

    const chat_starters = response.output_parsed;

    return NextResponse.json({ starters: chat_starters });
  } catch (error) {
    console.error('Error generating chat starters:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat starters' },
      { status: 500 },
    );
  }
}
