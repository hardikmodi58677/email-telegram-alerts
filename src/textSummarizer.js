// This code is for v4 of the openai package: npmjs.com/package/openai
import OpenAI from "openai";
import { CONFIG } from "./config.js";

const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY,
});

export const summarizeText = async (text) => {
  const response = await openai.completions.create({
    model:"gpt-3.5-turbo-instruct",
    prompt:`Make it under 250 words.Mention subject and name of the person who sent the mail as well:\n${text}\n`,
    max_tokens:250,
    temperature:0.4
  });
  return response.choices[0].text;
};