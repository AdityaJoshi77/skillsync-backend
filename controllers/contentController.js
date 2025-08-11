const mongoose = require("mongoose");
const { Content, Note, Article } = require("../models/ContentModel");
const {
  geminiSubmoduleArticleFetcher,
  geminiSubmoduleVideoFetcher,
} = require("../geminiAPI/geminiSubmoduleContentFetcher");
const {
  youtubeLinksDummy,
  articlesDummy,
} = require("../dummyData/dummyContent");

const withTransaction = require("../utils/withTransaction");

const generateArticles = withTransaction(async (req, res, session) => {
  const { contentId, skillName, moduleName, submoduleName, useAI } = req.body;

  // Get content doc
  const contentDoc = await Content.findById(contentId).session(session);
  if (!contentDoc) {
    console.log("Article Generation Failed: Parent Content not found");
    return res.status(404).json({
      message: "Article generation failed: Parent Content not found.",
    });
  }

  // Authenticate user
  if (contentDoc.userId.toString() !== req.user._id.toString()) {
    console.log("Article Generation Failed: Unauthorized user");
    return res.status(401).json({
      message: "Cannot generate articles: Unauthorized user.",
    });
  }

  // Fetch articles
  const fetchedArticles = useAI
    ? await geminiSubmoduleArticleFetcher(skillName, moduleName, submoduleName)
    : articlesDummy;

  if (!fetchedArticles || fetchedArticles.length === 0) {
    return res.status(200).json({ message: "No articles generated", data: [] });
  }

  // Save articles
  const articleDocs = await Article.insertMany(
    fetchedArticles.map((article) => ({
      title: article.title,
      link: article.link,
      summary: article.summary,
    })),
    { session }
  );

  // Link to content
  contentDoc.articles.push(...articleDocs.map((a) => a._id));
  await contentDoc.save({ session });

  return res.status(200).json({
    message: "Article generation successful",
    data: articleDocs,
  });
});

const generateVideos = withTransaction(async (req, res, session) => {
  const { contentId, skillName, moduleName, submoduleName, useAI } = req.body;

  // Get content doc
  const contentDoc = await Content.findById(contentId).session(session);
  if (!contentDoc) {
    console.log("Video Generation Failed: Parent Content not found");
    return res.status(404).json({
      message: "Video generation failed: Parent Content not found.",
    });
  }

  // Authenticate user
  if (contentDoc.userId.toString() !== req.user._id.toString()) {
    console.log("Video Generation Failed: Unauthorized user");
    return res.status(401).json({
      message: "Cannot generate videos: Unauthorized user.",
    });
  }

  // Fetch videos
  const fetchedVideos = useAI
    ? await geminiSubmoduleVideoFetcher(skillName, moduleName, submoduleName)
    : youtubeLinksDummy;

  if (!fetchedVideos || fetchedVideos.length === 0) {
    return res.status(200).json({ message: "No videos generated", data: [] });
  }

  // Save videos
  contentDoc.youtubeLinks.push(...fetchedVideos);
  await contentDoc.save({ session });

  return res.status(200).json({
    message: "Video generation successful",
    data: fetchedVideos,
  });
});

module.exports = {generateArticles, generateVideos}