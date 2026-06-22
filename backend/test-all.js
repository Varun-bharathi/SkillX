import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-flash-latest'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\nTesting ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hi');
      const response = await result.response;
      console.log(`SUCCESS: ${modelName} works! Response: ${response.text()}`);
    } catch (err) {
      console.log(`FAILED: ${modelName} - ${err.message}`);
    }
  }
}

testModels();
