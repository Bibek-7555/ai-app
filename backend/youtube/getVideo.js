import axios from "axios";

const API_KEY = 'AIzaSyAT_58EmVbJX892GwpAGhxHCKPxVby8VoM'; // Replace with your YouTube Data API key
const query = 'What elon musk say about tesla vandalism'; // Replace with your sentence query

// Encode the query to handle spaces and special characters



export async function getVideo(query) {
    const encodedQuery = encodeURIComponent(query);

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodedQuery}&type=video&key=${API_KEY}`;
    try {
        const response =await axios.get(url)
        //console.log("response", response);
        
        if (!response) {
            throw new Error('Network response was not ok');
        }
        //console.log(response);
        
        return `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;
    }
    catch(error)  {
        console.error('Error fetching data:', error);
    };
}

// async function demo() {
//     const response = await getVideo(query);
//     console.log(response);
//     console.log("The video link is: ", `https://www.youtube.com/watch?v=${response.id.videoId}`);
    
// }
// demo();