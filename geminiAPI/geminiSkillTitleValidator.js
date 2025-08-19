require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiValidateSkillTitle = async (title) => {
  const model = genAI.getGenerativeModel({
    // model: "models/gemini-1.5-flash-latest",
    model: "models/gemini-2.5-flash",
  });

  const prompt = `
You are an AI assistant helping validate user-submitted skill titles.  

Given a title: "${title}", decide if this is a VALID career-related skill suitable for generating a learning roadmap.  

Rules:  
- VALID skills include **technology, programming, development, or professional/career skills**.  
  Examples: "React.js", "Linux Basics", "Data Structures", "Public Speaking", "Digital Marketing", "Content Writing".  
- INVALID if:  
  - It is a **hobby/personal interest** (e.g., "baking", "gardening", "cooking", "painting").  
  - It is **gibberish or vague** (e.g., "asdf", "do it", "fast stuff").  
  - It is unrelated to **professional growth or career development**.  

Respond ONLY with:  
- VALID  
- INVALID  

No explanation or extra characters.
`;

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
