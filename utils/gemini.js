require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ This is key

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRoadmapFromGemini = async (skillName) => {
  const prompt = `
You are an AI that helps generate structured skill roadmaps.

We want you to break down a tech skill (e.g., "Learn React") into a sequence of modules. Each module represents a major milestone or concept, and contains several submodules that are atomic tasks.

Here is the schema structure you should follow:

Skill:
title: name of the overall skill
modules: list of Module objects

Module:
title: name of the module (e.g., "Learn CSS")
status: default to "Pending"
submodules: list of Submodule objects

Task:
title: a single task or concept (e.g., "Understand Flexbox")
type: must be one of ["Learning", "Practice", "Project"]
status: default to "Pending"

Guidelines:
Break down the skill "${skillName}".
Generate as many modules as needed to cover the skill thoroughly.
Each module should have 3–5 tasks.
tasks must be concrete, specific activities or concepts.
Use only the three types mentioned above.

Only return the modules array in valid JSON format — no preamble, no markdown.

Example Output:
[
  {
    "title": "Module Title",
    "status": "Pending",
    "submodules": [
      {
        "title": "Task Title",
        "type": "Learning",
        "status": "Pending"
      }
    ]
  }
]
`;

  try {
    console.log("Gemini API Key:", process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash-latest",
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up any markdown code fences from the Gemini response
    const cleaned = text.replace(/```json|```/g, "").trim();

    const roadMap = JSON.parse(cleaned);
    console.log("Gemini Roadmap:", roadMap);
    return roadMap;
  } catch (error) {
    console.error("Gemini roadmap generation failed:", error);
    throw new Error("Failed to generate roadmap.");
  }
};

module.exports = generateRoadmapFromGemini;
