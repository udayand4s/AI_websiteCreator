import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET() {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: "i love my girlfriend alot, what to do",
    });
    for await (const chunk of response) {
      console.log(chunk.text);
      
  }
  
}catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
