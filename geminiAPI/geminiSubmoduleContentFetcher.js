require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const searchYouTube = require('../youtubeAPI/youtubeSearch');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiSubmoduleArticleFetcher = async (
  skillName,
  ModuleName,
  SubmoduleName
) => {
  const model = genAI.getGenerativeModel({
    // model: "models/gemini-1.5-flash-latest",
    model: "models/gemini-2.5-flash",
  });

  const generationPrompt = `
You are a tech research assistant. Your job is to search the web for the most relevant and up-to-date articles on a given technology topic and produce concise, learner-friendly summaries.

The topic comes from a course structure:  
Skill → Module → SubModule  

Context:  
Skill: ${skillName}  
Module: ${ModuleName}  
SubModule: ${SubmoduleName}  

Your task:  
1. Find the 3 most relevant, authoritative articles that match this exact context.  
2. Write a clear, learner-friendly summary for each article (~80–120 words), focusing on key concepts, important techniques, and practical applications relevant to the submodule.
3. Return ONLY a valid JSON array of 3 objects in the following format:  

[
  {
    "title": "Exact Article Title",
    "link": "Direct Article URL",
    "summary": "Concise learner-friendly summary."
  }
]

Rules:  
- No markdown formatting, no extra text, no explanations outside the JSON.  
- Links must be direct to the source, not shortened or redirected.  
- Summaries should focus on practical learning points for someone studying this submodule.

`;

  try {
    console.log("🛠 Getting Articles for:", SubmoduleName);
    const generationResult = await model.generateContent(generationPrompt);
    const rawText = generationResult.response.text();
    console.log("📄 Raw Gemini Output:\n", rawText);

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const articles = JSON.parse(cleaned);
    console.log("✅ Parsed Roadmap:", articles);

    return articles;
  } catch (error) {
    console.error("❗ Gemini roadmap generation failed:", error.message);
    return [];
  }
};

const geminiSubmoduleVideoFetcher = async (
  skillName,
  moduleName,
  submoduleName
) => {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
  });

  const generationPrompt = `
You are a helpful assistant. Given the following context, generate a concise and effective YouTube search query that would return the most relevant videos for this topic.

Context:
Skill: ${skillName}
Module: ${moduleName}
SubModule: ${submoduleName}

Return ONLY a single search query string. No explanations or formatting.
`;

  try {
    console.log("🎥 Generating search query for:", submoduleName);
    const generationResult = await model.generateContent(generationPrompt);
    const query = generationResult.response.text().trim();
    console.log("🔍 Generated search query:", query);

    const videos = await searchYouTube(query);

    // Transform to only include title and full YouTube link as "link"
    const formattedVideos = videos.map((video) => {
      const videoId = video.id.videoId || (video.id.playlistId ? video.id.playlistId : "");
      return {
        title: video.snippet.title,
        link: videoId ? `https://www.youtube.com/watch?v=${videoId}` : "",
      };
    }).filter(v => v.link !== ""); // filter out if no valid videoId

    return formattedVideos;
  } catch (error) {
    console.error("❗ Video fetching failed:", error.message);
    return [];
  }
};


module.exports = { geminiSubmoduleArticleFetcher, geminiSubmoduleVideoFetcher };
