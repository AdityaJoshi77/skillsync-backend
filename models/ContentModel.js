// models/content.js
const mongoose = require("mongoose");

// Note schema
const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    submoduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Submodule", required: true },
  },
  { timestamps: true }
);

// YoutubeLinks schema
const youtubeLinksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Article schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  summary: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// NEW ARTICLE SCHEMA : (TO BE IMPLEMENTED....)
/**
 * const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String[], required: true },
  summary: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

Instead of array of objects having links for the articles and their individual summary, 
we will now have a single article summary and an array of links of web articles which 
the user can refer for future use.
 */

// Content schema
const contentSchema = new mongoose.Schema({
  youtubeLinks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "YoutubeLink" }],
    default: [],
  },

  // Array of references to Article documents
  articles: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    default: [],
  },

  // New Article Field:
  /**
   * article:{
   *  type: mongoose.Schema.Types.ObjectId,
   *  ref: "Article"
   * }
   */

  // Array of references to Note documents
  notes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    default: [],
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Export models
module.exports = {
  Content: mongoose.model("Content", contentSchema),
  Note: mongoose.model("Note", noteSchema),
  Article: mongoose.model("Article", articleSchema),
  YoutubeLink: mongoose.model("YoutubeLink", youtubeLinksSchema),
};
