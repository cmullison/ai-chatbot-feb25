/* eslint-disable import/no-named-as-default */
// API route for generating chat suggestions
import { type NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const ChatReplies = z.object({
  replies: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const { previous_response } = await req.json();
    console.log('Received previous response:', previous_response);

    if (!previous_response) {
      return NextResponse.json(
        { error: 'No previous response provided' },
        { status: 400 },
      );
    }

    const prompt = `
Given this previous AI response, generate 2-3 varied natural follow-up questions or responses that a user might want to ask. These can be related to the specific content and context of the previous response, or an extension of the previous response to further explore the topic or branch out into related topics.  If the previous response is a question, generate at least one direct response.

Previous AI response:
"${previous_response}"

Format your response as a JSON array of strings, each being a contextual follow-up question or response. Make sure each suggestion is directly related to the specific details mentioned in the previous response.
    `.trim();

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await openai.responses.parse({
      model: 'gpt-4.1-nano',
      input: [{ role: 'user', content: prompt }],
      text: {
        format: zodTextFormat(ChatReplies, 'chat_replies'),
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
