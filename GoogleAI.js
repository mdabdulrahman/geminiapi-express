import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { API_KEY } from "./Configs.js";

export const genAI = new GoogleGenerativeAI(API_KEY);
export const fileManager = new GoogleAIFileManager(API_KEY);
export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
