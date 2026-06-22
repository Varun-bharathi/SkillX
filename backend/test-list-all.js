import dotenv from "dotenv";
dotenv.config();

async function test() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY);
    const data = await response.json();
    console.log("Model names:");
    data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
