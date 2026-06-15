import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
// import OpenAI from "openai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//#start sample code
export async function liveInterview(req, res) {
  {
    /*  
            const client = new OpenAI({
              apiKey: process.env.API_SECRETKEY,
            });
          
            const response = await client.chat.completions.create({
              model: "gpt-5.5",
              messages: [
                { role: "developer", content: "talk like a pirate." },
                {
                  role: "user",
                  content: "are semicolons are optional in javaScript ?",
                },
              ],
            });
            console.log(response);
            */
  }
  const prompt = req.body.prompt;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  res.status(200).json({ message: "ok", data: response.text });
}
//#end sample code

async function askAI({ messages }) {
  const prompt = messages.map((item) => {
    return `${item.role} : ${item.content}`;
  });

  try {
    // GEMINI AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (err) {
    return Promise.reject(err);
  }
}

export { askAI };
