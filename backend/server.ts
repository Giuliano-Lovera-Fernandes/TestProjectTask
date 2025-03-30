// Importing dotenv library to load environment variables
import dotenv from "dotenv";
dotenv.config();  // Loads the variables from the .env file

// Importing required libraries
import axios from "axios"; // Axios for making HTTP requests - https://axios-http.com/docs/api_intro 
import express from "express"; // Express for server creation - https://bun.sh/guides/ecosystem/express 
import cors from "cors"; // CORS middleware for cross-origin requests


const jsdom = require("jsdom"); // JSDOM for manipulating HTML documents
const { JSDOM } = jsdom; // JSDOM for DOM manipulation in Node.js - https://www.npmjs.com/package/jsdom

// Initializing Express application
const router = express.Router();
const app = express();
const port = 3000;

// Middleware Configuration
app.use(cors({
    origin: "http://localhost:5173", // Allow only this domain for cross-origin requests
    methods: ["GET", "POST"], // Define the allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Define the allowed request headers
}));

// Function to validate the 'keyword' parameter
// Ensures that the keyword is a non-empty string
function validateKeyword(keyword: any) {
    if (typeof keyword !== 'string' || keyword.trim() === '') {
        return { valid: false, message: 'Keyword must be a non-empty string' };
    }
    return { valid: true, message: '' };
}

// Function to extract product data
function extractProductData(product: { title: string; rating: number; ratings_total: number; image: string }): Product {
    return {
        title: product.title || 'No title',
        rating: product.rating || 0,
        number_of_reviews: product.ratings_total || 0,
        image: product.image || 'N/A',
    };
}

router.get('/api/scrape', async (req, res) => {
    const { keyword } = req.query;

    // Validate the 'keyword' parameter
    const validation = validateKeyword(keyword);
    if (!validation.valid) {
        return res.status(400).json({ status: 'error', message: validation.message });
    }

    console.log("Received request /api/scrape with keyword:", keyword);

    try {
        const params = {
            api_key: process.env.API_KEY,
            amazon_domain: "amazon.com",
            type: "search",
            search_term: keyword
        };

        // Sending the request to the Rainforest API
        const response = await axios.get('https://api.rainforestapi.com/request', { params });

        // Check if the response is successful
        if (response.status === 200 && response.data.search_results) {
            let products: Product[] = [];

            // Iterate over each product in the search results
            response.data.search_results.forEach((product: { title: string; rating: number; ratings_total: number; image: string }) => {
                products.push(extractProductData(product));
            });

            console.log('Extracted products: ', products);

            res.json({
                status: "healthy",
                message: "API is up and running",
                products: products
            });
        } else {
            res.status(500).json({ status: "unhealthy", message: "Invalid response from Rainforest API" });
        }
    } catch (error) {
        console.error('Error fetching from Rainforest API:', error);
        res.status(500).json({ status: "unhealthy", message: "Error with Rainforest API" });
    }
});

// Route handler for the health check endpoint
router.get('/health-check', (req, res) => {
    try {

        // Create an in-memory HTML structure using JSDOM
        const dom = new JSDOM(`<html>
                <head><title>Health Check</title></head>
                <body>
                    <h1>Server is running</h1>
                    <div id="content"></div>
                    <script>document.getElementById("content").append(document.createElement("hr"));</script>
                </body>
            </html>`);

        console.log('Body innerHTML:', dom.window.document.body.innerHTML);

        // Get full HTML as a string
        const htmlContent = dom.window.document.documentElement.outerHTML;

        res.send(htmlContent);

        // If needed for frontend testing, you can use the following line to return a JSON response with the title:
        //res.json({ status: "healthy", message: title }); for frontend test
    } catch (error) {

        // Handle errors and send a failure response with an appropriate status code
        res.status(500).json({ status: "unhealthy", message: "Error processing JSDOM" });
    }
});

app.use(router);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

interface Product {
    title: string;
    rating: number;
    number_of_reviews: number;
    image: string
}
