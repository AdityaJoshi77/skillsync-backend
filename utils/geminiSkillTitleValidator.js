require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai"); 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiValidateSkillTitle = async (title) => {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash-latest",
  });

  const prompt = `
You are an AI assistant helping validate user-submitted skill titles.

Given a title: "${title}", decide if this is a VALID tech-related skill suitable for generating a learning roadmap.

Rules:
- It must be clearly related to technology, programming, or development (e.g., "React.js", "Linux Basics", "Data Structures").
- It must not be gibberish or vague (e.g., "asdf", "do it", "fast stuff").
- It should be something people actually learn or work on in the tech/software industry.

Respond ONLY with:
- VALID
- INVALID

No explanation or extra characters.`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const verdict = raw.trim().toUpperCase();

    return verdict === "VALID" ? "VALID" : "INVALID";
  } catch (err) {
    console.error("Gemini validation failed:", err);
    return "INVALID"; // fallback to safe
  }
};

module.exports = geminiValidateSkillTitle;
