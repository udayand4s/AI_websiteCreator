import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getSystemPrompt } from "../prompt/route";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET() {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        text: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featuredand worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks,and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary orI request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate,only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\nHere is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n\n",
      },
      {role: "user",
        text: "create a simple todo calculator",
      },
    ],
      config: {
        systemInstruction: getSystemPrompt(),
      },
      
    });
    for await (const chunk of response) {
      console.log(chunk.text);
      
  }
  
}catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
