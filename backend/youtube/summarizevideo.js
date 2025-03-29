import { VertexAI } from "@google-cloud/vertexai";
const PROJECT_ID = 'my-project-1742452269752';
const LOCATION = 'asia-south1';

export async function summarizeVideo(youtubeVideoURL) {
    try {
        console.log("The youtube video URL is: ", youtubeVideoURL);
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        if(!vertexAI) {
            console.error('Vertex AI not initialized');
            throw new Error('Vertex AI not initialized');
        }
        const generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        if(!generativeModel) {
            console.error('Generative model not initialized');
            throw new Error('Generative model not initialized');
        }
        const requestBody = {
            contents: [
              {
                role: "user",
                parts: [
                  { text: "Summarize this video." },
                  { fileData: { mimeType: "video/mp4", fileUri: youtubeVideoURL } }
                ]
              }
            ]
          };

        
        const response = await generativeModel.generateContent(requestBody);
        // console.log("The response is: ", response);
        // console.log("The response of summary is: ", response.response.candidates[0].content.parts[0].text);
        const result = response.response.candidates[0].content.parts[0].text;
        console.log("Summary text: ", result);
        return result;
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Error is: ', error);
    }
}

