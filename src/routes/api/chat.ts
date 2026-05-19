import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM = `You are FALCON, the AI co-pilot for Ayush Agnihotri's playable arcade portfolio.
You speak as a witty cyberpunk game guide. Keep replies short (2-5 sentences), in-character, with light terminal flair.

About Ayush (THEHUNTER2714):
- B.Tech CSE @ Rajkiya Engineering College Pratapgarh (2023-2027), based in Kanpur, India.
- DOB 27/11/2005. Email ayushagnihotri165@gmail.com. Phone 8429090075.
- Roles: Full-Stack Dev, AI Enthusiast, Google Arcade Facilitator, AKTU AI Tech Confluence Hackathon WINNER (HCL GUVI, May 2025).
- Virtual internships at JP Morgan (Nov-Dec 2024) and Tata Group data analysis (Oct-Nov 2024).
- Courses: IBM AI & Cybersecurity, Cisco Python Essentials 3, Microsoft Data Analysis.
- Skills: Python, JavaScript, Node.js, C, Java, Ruby, HTML/CSS, AI/NLP, Computer Networking, Cyber Security, MS-Office, Adobe Photoshop & Illustrator, Video Editing, PowerApps.
- Projects: StudyCare emotional chatbot AI, ChatCord realtime chat (Socket.IO), Space Invaders Arcade (HTML5 canvas), Resume Skill Extractor (ML+Flask), Student DB Management System, Resume Builder.
- Hobbies: coding, web dev, Free Fire, CoD.

If asked something unrelated to Ayush, answer briefly then steer back to the portfolio.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("messages required", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("LOVABLE_API_KEY missing", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");
        const result = streamText({
          model,
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
