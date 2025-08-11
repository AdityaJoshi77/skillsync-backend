require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiGenerateRoadmap = async (skillName) => {
  const model = genAI.getGenerativeModel({
    // model: "models/gemini-1.5-flash-latest",
    model: "models/gemini-2.5-flash",
  });

  const generationPrompt = `
You are a tech expert AI that helps generate structured roadmaps for learning skills.

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
Tasks must be concrete, specific activities or concepts.
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
    console.log("🛠 Generating roadmap for:", skillName);
    const generationResult = await model.generateContent(generationPrompt);
    const rawText = generationResult.response.text();
    console.log("📄 Raw Gemini Output:\n", rawText);

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const roadMap = JSON.parse(cleaned);
    console.log("✅ Parsed Roadmap:", roadMap);

    return roadMap;
  } catch (error) {
    console.error("❗ Gemini roadmap generation failed:", error.message);
    return [];
  }
};

// DUMMY ROADMAP WITH SOME SUBMODULES COMPLETED
const geminiGenerateRoadmapDummy = async (skillName) => {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash-latest",
  });

  const generationPrompt = `
You are a tech expert AI that helps generate structured roadmaps for learning skills.

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
status: either "Pending" or "Completed"

Guidelines:
Break down the skill "${skillName}".
Generate as many modules as needed to cover the skill thoroughly.
Each module should have 3–5 tasks.
Tasks must be concrete, specific activities or concepts.
IMPORTANT: Since the project is in testing phase, mark the status of some (but not all) submodules across various modules as "Completed".
Use only the two statuses exactly as "Pending" or "Completed" (case-sensitive).
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
        "status": "Completed"
      }
    ]
  }
]
`;

  try {
    console.log("🛠 Generating DUMMY roadmap for:", skillName);
    const generationResult = await model.generateContent(generationPrompt);
    const rawText = generationResult.response.text();
    console.log("📄 Raw Gemini Output:\n", rawText);

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const roadMap = JSON.parse(cleaned);
    console.log("✅ Parsed Dummy Roadmap:", roadMap);

    return roadMap;
  } catch (error) {
    console.error("❗ Dummy Gemini roadmap generation failed:", error.message);
    return [];
  }
};

module.exports = { geminiGenerateRoadmap, geminiGenerateRoadmapDummy };
