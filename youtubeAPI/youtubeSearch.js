const { google } = require("googleapis");
require("dotenv").config();

const searchYouTube = async (query) => {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    const response = await youtube.search.list({
      part: "snippet",
      q: query,
      maxResults: 5,
    });

    return response.data.items;

  } catch (error) {
    console.log('Youtube fetch failed');
    console.error(error);
    return [];
  }
};

module.exports = searchYouTube;
// Example usage:
// searchYouTube('SkillSync project').then(videos => {
//   console.log(videos);
// }).catch(console.error);
