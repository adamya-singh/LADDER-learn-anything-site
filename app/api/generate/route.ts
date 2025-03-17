import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { parentContent, position } = await req.json();

    const prompt = `Given the concept "${parentContent}", generate a related subtopic or skill that would be ${position === 'left' ? 'a foundational prerequisite' : 'an advanced application'} of this concept. Respond with just the subtopic name or skill, keep it concise (max 4 words).`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable tutor helping to break down learning concepts into prerequisite skills and advanced applications. Keep responses very concise."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 50,
    });

    const content = completion.choices[0].message.content?.trim();

    return NextResponse.json({ content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 