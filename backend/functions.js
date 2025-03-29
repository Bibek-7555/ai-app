import { GoogleGenerativeAI } from "@google/generative-ai";
import { getVideo } from "./youtube/getVideo.js";
import {summarizeVideo} from "./youtube/summarizevideo.js"
import dotenv from 'dotenv'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

dotenv.config(
    {
        path: './.env'
    }
);
async function getWeatherData(cityName) {

    try {
        console.log("In try block of getWeatherData");
        console.log("In try block of getWeatherData with city:", cityName);
        
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${cityName}&aqi=yes`)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("response", response);
        const data = await response.json();
        const current = data.current;
        const tempC = current.temp_c;
        return tempC;
    } catch (error) {
      console.error('Error fetching weather data', error);
        
    }
  }

  async function getAQIData(cityName) {
    try {
        console.log("In try block of getAQIData");
        
        const response = await fetch(`https://api.waqi.info/feed/${cityName}/?token=${process.env.TOKEN}`)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("data is: ", data);
        return data.data.aqi;
    } catch (error) {
        console.error('Error fetching weather data', error);
    }
  }
  


export const getCityTemperatureInCelsiusFunctionDeclaration = {
    name: "getCityTemperatureInCelsius",
    parameters: {
        type: "OBJECT",
        description: "Get weather data for a city",
        properties: {
            cityName: {
                type: "STRING",
                description: "Name of the city to get weather data for with the first letter of the city in capital letter i.e. Mumbai or New York",
            }
        },
        required: ["cityName"],
    },
};

export const getCityAQIFunctionDeclaration = {
    name: "getCityAQI",
    parameters: {
        type: "OBJECT",
        description: "Get aqi data for a city",
        properties: {
            cityName: {
                type: "STRING",
                description: "Name of the city to get weather data for with the first letter of the city in small letters i.e. mumbai or new York",
            }
        },
        required: ["cityName"],
    },
}

export const getYoutubeVideoFunctionDeclaration = {
    name: "getYoutubeVideoURL",
    parameters: {
        type: "OBJECT",
        description: "Get youtube video URL for a query",
        properties: {
            query: {
                type: "STRING",
                description: "Query for the youtube video",
            }
        },
        required: ["query"],
    },
}

  // Put functions in a "map" keyed by the function name so it is easier to call

  export const functions = {
    getCityTemperatureInCelsius: async (cityName) => {
        console.log("In getCityTemperatureInCelsius");
        console.log("In getCityTemperatureInCelsius with city:", cityName);
        
        const temp = await getWeatherData(cityName);
        console.log(temp);
        return temp;
      },
    getCityAQI: async (cityName) => {
        console.log("In getCityAQI");
        try {
            const aqi = await getAQIData(cityName);
            console.log(aqi);
            return aqi;
        } catch (error) {
            console.error('Error fetching weather data', error);  
            
        }
        
    },
    getYoutubeVideoURL: async ({query}) => {
        console.log("In getYoutubeVideo");
        console.log("In getYoutubeVideo with query:", query);
        try {
            const videoURL = await getVideo(query);
            console.log(videoURL);
            return videoURL;
        } catch (error) {
            console.error('Error fetching youtube video', error);  
            
        }
        
    },
    getSummaryOfYoutubeVideo: async ({youtubeVideoURL}) => {
        console.log("In getSummaryOfYoutubeVideo");
        console.log("In getSummaryOfYoutubeVideo with youtubeVideoURL:", youtubeVideoURL);
        try {
            const summary = await summarizeVideo(youtubeVideoURL);
            // console.log(summary);
            return summary;
        } catch (error) {
            console.error('Error fetching youtube video', error);  
            
        }
        
    }
  };


//   return {
//     name: "getYoutubeVideoURL",
//     response: {
//         name: "getYoutubeVideoURL",
//         content: { video_url: videoUrl }
//     }
// };