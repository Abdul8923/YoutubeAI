import { GoogleGenAI, Type } from "@google/genai";
import type { Course } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const courseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A compelling and relevant title for the course based on the video's content." },
    description: { type: Type.STRING, description: "A brief, one-paragraph summary of what the course covers." },
    keyTakeaways: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 key learning points or takeaways from the video."
    },
    modules: {
      type: Type.ARRAY,
      description: "A list of 3-4 structured modules. Each module should represent a distinct section or topic from the video.",
      items: {
        type: Type.OBJECT,
        properties: {
          moduleTitle: { type: Type.STRING, description: "The title of the module." },
          summary: { type: Type.STRING, description: "A detailed summary of the concepts covered in this module." },
          quiz: {
            type: Type.ARRAY,
            description: "A quiz with 2-3 multiple-choice questions to test understanding of the module's content.",
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "The quiz question." },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "An array of 4 possible answers."
                },
                correctAnswer: { type: Type.STRING, description: "The correct option from the 'options' array." }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        },
        required: ["moduleTitle", "summary", "quiz"]
      }
    }
  },
  required: ["title", "description", "keyTakeaways", "modules"]
};


export const generateCourse = async (url: string, title: string): Promise<Course> => {
    const titlePromptSection = title
      ? `The user has also provided a title for the video: "${title}". Use this title as a strong contextual clue for the video's content.`
      : `Analyze the content of the video at the provided URL to determine its topic.`;

    const prompt = `You are an AI specializing in creating educational content. Your sole task is to generate a structured mini-course based *only* on the content of a single YouTube video.

    The user has provided this URL: "${url}"
    ${titlePromptSection}

    It is absolutely crucial that the course content you generate is directly and exclusively derived from the specific subject matter of this single video. Do not create a general course on the broad topic; instead, create a course that reflects what one would learn from watching this particular video. For example, if the video is 'Learn CSS Grid in 20 Minutes', the course should cover only the concepts presented in that video, not the entirety of CSS Grid.

    The course must have the following structure:
    1.  **title**: A compelling title for the course that accurately reflects the video's content.
    2.  **description**: A brief, one-paragraph summary of what this specific course covers.
    3.  **keyTakeaways**: A list of 3-5 specific, key learning points from the video.
    4.  **modules**: A list of 3-4 structured modules. Each module should logically break down the video's content into distinct sections and contain:
        a. **moduleTitle**: A clear and descriptive title for the module.
        b. **summary**: A detailed summary of the concepts likely covered in this part of the video.
        c. **quiz**: A quiz with 2-3 multiple-choice questions to test understanding of the module's content. Each question must have exactly 4 options and one correct answer.

    Your entire output must be a single, valid JSON object that adheres to the provided schema. Do not include any text, explanations, or markdown formatting outside of the JSON object.`;


  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
        temperature: 0.7,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error("Received an empty response from the AI service.");
    }

    try {
      // The model should return a clean JSON string, but to be robust,
      // we'll find the JSON object within any potential surrounding text.
      const startIndex = rawText.indexOf('{');
      const endIndex = rawText.lastIndexOf('}');

      if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        console.error("No valid JSON object found in response:", rawText);
        throw new Error("Response did not contain a valid JSON object.");
      }

      const jsonString = rawText.substring(startIndex, endIndex + 1);
      const courseData: Course = JSON.parse(jsonString);

      // Basic validation
      if (!courseData.title || !courseData.modules || !Array.isArray(courseData.modules)) {
        console.error("Parsed JSON is missing required fields:", courseData);
        throw new Error("AI returned incomplete course data.");
      }

      return courseData;

    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      console.error("Raw response text for debugging:", rawText);
      throw new Error("AI returned malformed data that could not be parsed.");
    }

  } catch (error) {
    console.error("Error in generateCourse:", error);
    // Re-throw the error to be caught by the UI component
    throw error;
  }
};