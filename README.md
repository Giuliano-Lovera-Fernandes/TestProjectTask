# testprojecttask

This project was created using bun init in bun v1.2.6. Bun is a fast all-in-one JavaScript runtime.
This project was created using `bun init` in bun v1.2.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Scrape API
This project is a Node.js-based backend application that utilizes the Rainforest API to scrape Amazon product data. The API provides an endpoint to search for products based on a keyword and return the results as a JSON response.

Key Features
Scraping Amazon Products: Retrieves product information such as title, rating, number of reviews, and image URL.

Health Check Endpoint: Provides a route to check the server status.

CORS Support: Configured to allow cross-origin requests from a specified frontend application.

Technologies Used
Node.js: JavaScript runtime environment for running the server.

Express.js: Web framework for building the RESTful API.

Axios: Used to make HTTP requests to the Rainforest API.

JSDOM: For manipulating and rendering HTML.

dotenv: To securely load environment variables, including API keys.

API Endpoints
GET /api/scrape
Description: Fetches product data from Amazon using the keyword provided as a query parameter.

Query Parameters:

keyword: The keyword to search for (e.g., laptop).

Response: Returns a list of products with title, rating, number of reviews, and image URL.

API_KEY: Your API key for accessing the Rainforest API.

To install dependencies:

```bash
npm install   # Install dependencies
```

To run:

```bash
bun run index.ts
```

Frontend - Product Search
This is a frontend application that allows users to search for products from Amazon using keywords. The application fetches data from the backend and displays the results in a table format.

Features
Product Search: Users can enter a keyword to search for Amazon products.

Product Display: The search results show product title, rating, number of reviews, and image.

Dynamic Table: Products are displayed in a responsive table with options to adjust quantity and remove items.

Loading Indicator: A loading indicator is shown when the search request is in progress.

Snackbar Notifications: Feedback messages are displayed for success, error, or warning.

How It Works
Search: The user inputs a keyword and clicks the "Fetch Data" button.

API Request: The frontend sends a request to the backend API with the entered keyword.

Display Results: The backend returns product data, which is displayed in a table with product images, ratings, and other details.

Adjust Quantity: Users can increase or decrease the quantity of each product.

Remove Item: Users can remove items from the table.

Loading & Notifications: A loading indicator is displayed while fetching data, and snackbar notifications show success or error messages.

Technologies Used
Vanilla JavaScript: To handle logic and DOM manipulation.

CSS: For styling the frontend interface.

HTML: For structuring the layout.

To run:

```bash
npm install   # Install dependencies
npm run start
```
