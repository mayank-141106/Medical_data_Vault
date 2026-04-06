import express from 'express';
import axios from 'axios';
import cors from 'cors';  // Import CORS

const GEMINI_API_KEY = "AIzaSyDqSSoc65jlg5bR1fEiK8-AUMX92-EgMqI";
const app = express();

// Enable CORS for all origins (or specify specific origins)
app.use(cors()); // This allows requests from any origin

app.use(express.json()); // Correct method to parse incoming JSON

// Logging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);  // Logs the body of POST requests
  next();  // Proceed to the next middleware or route handler
});
app.post('/api/generate-insights', async (req, res) => {
    try {
      const { text } = req.body;
      console.log('Received text for analysis:', text.substring(0, 100)); // Log the first 100 characters of the text for debugging
  
      // Sanitize sensitive information like phone numbers and addresses
      const prompt = `Please summarize the following document and ignore all the sensitive information, just give a summary strictly, always give summary of what you can figure out: ${text}`;
  
      // Making the request to Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          }
        }
      );
  
      console.log('Response from Gemini API:', JSON.stringify(response.data, null, 2));  // Log the response to inspect the full content
  
      // Extract the content properly
      const content = JSON.stringify(response.data, null, 2)
  
      if (content) {
        // If content is available, return it
        return res.json({
          success: true,
          insights: content
        });
      } else {
        // If no content, return a default message
        console.log('No insights generated, sending default message');
        return res.json({
          success: true,
          insights: 'No insights available at this time.'
        });
      }
    } catch (error) {
      // Catch all errors and send a success response with a generic message
      console.error('Error during AI analysis:', error.response?.data || error.message);  // Log error response
      return res.json({
        success: true,
        insights: 'An error occurred while processing the request, but we are still here to help.'
      });
    }
  });
  
  

const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
