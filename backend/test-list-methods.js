import dotenv from "dotenv";
dotenv.config();

async function test() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY);
    const data = await response.json();
    const model = data.models.find(m => m.name === "models/gemini-2.0-flash-exp");
    console.log("Model:", model);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
