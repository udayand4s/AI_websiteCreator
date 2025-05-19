import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt } from "../prompt/SystemPrompt";
import { basePrompt as node } from "@/app/api/defaults/node";
import { basePrompt as react } from "@/app/api/defaults/react";
import { basePrompt as next } from "@/app/api/defaults/next";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt } = body;
  console.log("Prompt received:", prompt);
  // Check if the prompt is empty or undefined
  if (!prompt || prompt.trim() === "") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    // First, determine which type of project to create
    const initialPromptResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        
          role: "user",
          text: prompt
        
      },{
        role: "user",
        text: "Return either node or react or nextjs code based on what do you think the project should be. Only return a single word, either 'node', 'react' or 'nextjs'. Do not return any other text."
      }]
    });
    
    const rawResponse = initialPromptResponse.text ?? "";
    console.log("Raw response:", rawResponse);
    
    // Determine which template to use
    let templateToUse;
    let projectType;
    
    if (rawResponse.includes("node")) {
      templateToUse = node;
      projectType = "node";
    } else if (rawResponse.includes("react")) {
      templateToUse = react;
      projectType = "react";
    } else if (rawResponse.includes("nextjs")) {
      templateToUse = next;
      projectType = "nextjs";
    } else {
      // Default to Next.js
      templateToUse = next;
      projectType = "nextjs";
    }
    
    console.log(`Using ${projectType} template`);
    
    // Now generate the actual project content using the selected template
    const baseTemplate = templateToUse; // This should be your template string
    
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          text: `Now make the application what user has indicated in the tech stack.It should be made in ${baseTemplate}. For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.`
        },
        {
          role: "user",
          text: `\n\nHere is an artifact that contains all files of the project visible to you.
        Consider the contents of ALL files in the project.\n\n${baseTemplate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n\n`
        },
        
      ],
      config: {
        systemInstruction: getSystemPrompt()
      }
    });
    
    for await (const chunk of response) {
      console.log(chunk.text);
      if (chunk.text) {
        const responseText =chunk.text;
        console.log("Response text:", responseText);
        return NextResponse.json({ response: responseText });
      }
  }
   
  
}catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
