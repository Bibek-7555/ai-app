import { GoogleGenerativeAI } from "@google/generative-ai";
import { functions, getCityAQIFunctionDeclaration, getCityTemperatureInCelsiusFunctionDeclaration, getYoutubeVideoFunctionDeclaration } from "./functions.js";
import { summarizeVideo } from "./youtube/summarizevideo.js";
import dotenv from 'dotenv/config';

dotenv.config(
  {
    path: './.env'
  }
);


 const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);

// async function runMultiTurn() {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   // Start conversation with Gemini
//   let chatSession = model.startChat({
//       tools: [
//           {
//               functionDeclarations: [
//                   {
//                       name: "getYoutubeVideoURL",
//                       description: "Finds a YouTube video URL based on a query.",
//                       parameters: {
//                           type: "OBJECT",
//                           properties: {
//                               query: { type: "STRING", description: "Search query for a YouTube video." }
//                           },
//                           required: ["query"]
//                       }
//                   },
//                   {
//                       name: "getSummaryOfYoutubeVideo",
//                       description: "Summarizes youtube video using the video URL.",
//                       parameters: {
//                           type: "OBJECT",
//                           properties: {
//                             youtubeVideoURL: { type: "STRING", description: "The YouTube video URL" }
//                           },
//                           required: ["youtubeVideoURL"]
//                       }
//                   }
//                 ]
//               }
//           ]
//       });
//       let result = await chatSession.sendMessage("Find a YouTube video posted by google for developers channel about gemma3 release and summarize the video to find what are the exciting features we get with it and ehat are it's sizes");
//       console.log("Results are ", result)
//       console.log("Function call is: ", result.response.functionCalls());
//       if (result.response.functionCalls) {
//             let call = result.response.functionCalls()[0];
//             console.log("Function call is: ", call);
//             console.log("Function call name is: ", call.name);
//             console.log("Function call args are: ", call.args.query);
//             // Call the executable function
            
//             // Step 1: Get the YouTube video URL
            
//             let youtubeResponse = await functions[call.name](call.args.query);
//             console.log("Youtube response is: ", youtubeResponse);
            
//             // Step 2: Send the video URL back to Gemini
//             // Step 2: Send the video URL back to Gemini
//             // Step 2: Send the video URL back to Gemini
//             const response = await chatSession.sendMessage([
//                 {
//                 functionResponse: {
//                     name: call.name,
//                     response: {
//                     content: youtubeResponse
//                     }
//                 }
//                 }
//             ]);
//             console.log("Response is: ", response);
//             console.log("Function calls are: ", response.response.functionCalls());
    

//             let nextFunctionCall = response.response.functionCalls();
//             console.log("Next function call is: ", nextFunctionCall);
//             // console.log("Next function call name is: ", nextFunctionCall.name);
//             // console.log("Next function call args are: ", nextFunctionCall.args.youtubeVideoURL);
//             if (nextFunctionCall && nextFunctionCall.length > 0) {
//                 let nextCall = nextFunctionCall[0];
//                 //console.log("Next function call is: ", nextCall);
//                 console.log("Next function call name is: ", nextCall.name);
//                 console.log("Next function call args are: ", nextCall.args);
//                 let summarizeYoutubeVideo = await functions[nextCall.name](nextCall.args);
    
//                 const finalResponse = await chatSession.sendMessage([
//                     {
//                       functionResponse: {
//                         name: nextCall.name,
//                         response: {
//                           content: summarizeYoutubeVideo
//                         }
//                       }
//                     }
//                   ]);
//                 console.log(finalResponse.response.candidates[0].content.parts[0].text);
//             }
//     }
// }

// runMultiTurn();

async function runMultiTurn() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Start conversation with Gemini
  let chatSession = model.startChat({
    tools: [
      {
        functionDeclarations: [
          {
            name: "getYoutubeVideoURL",
            description: "Finds a YouTube video URL based on a query.",
            parameters: {
              type: "OBJECT",
              properties: {
                query: { type: "STRING", description: "Search query for a YouTube video." }
              },
              required: ["query"]
            }
          },
          {
            name: "getSummaryOfYoutubeVideo",
            description: "Summarizes youtube video using the video URL.",
            parameters: {
              type: "OBJECT",
              properties: {
                youtubeVideoURL: { type: "STRING", description: "The YouTube video URL" }
              },
              required: ["youtubeVideoURL"]
            }
          }
        ]
      }
    ]
  });

  // Initial user query
  let result = await chatSession.sendMessage("Find a YouTube video by google gor developers channeel about gemma3 release by google and summarize the video to find what are the exciting features we get with it and ehat are it's sizes");
  
  // Process function calls in a loop until there are no more function calls
  // ...existing code...
  // Process function calls in a loop until there are no more function calls
  while (result.response.functionCalls?.()?.length > 0) {
    result = await handleFunctionCall(chatSession, result);
  }

  // Display the final text response
  if (result.response.candidates && result.response.candidates[0]) {
    console.log(result.response.candidates[0].content.parts[0].text);
  }
}

// Helper function to handle function calls and responses
async function handleFunctionCall(chatSession, result) {
  const functionCalls = result.response.functionCalls();
  
  if (!functionCalls || functionCalls.length === 0) {
    return result;
  }
  
  const call = functionCalls[0];
  console.log("Function call is:", call);
  console.log("Function call name is:", call.name);
  console.log("Function call args are:", call.args);
  
  // Execute the function
  // const functionArgs = call.name === "getYoutubeVideoURL" ? call.args.query : call.args;
  const functionArgs = call.args;
  const functionResponse = await functions[call.name](functionArgs);
  console.log(`${call.name} response is:`, functionResponse);
  
  // Send the function response back to Gemini
  const response = await chatSession.sendMessage([{
    functionResponse: {
      name: call.name,
      response: {
        content: functionResponse
      }
    }
  }]);
  
  console.log("Response is:", response);
  console.log("Function calls are:", response.response.functionCalls());
  
  return response;
}

runMultiTurn();