// server.js
const express = require("express");
const axios = require("axios");
const { convert } = require("html-to-text");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Replace with Your keys
const scrapingBeeApiKey = "REPLACE_WITH_SCRAPING_BEE_API_KEY";
const customSearchApiKey = "REPLACE_WITH_CUSTOM_SEARCH_API_KEY";
const customSearchEngineID = "REPLACE_WITH_CUSTOM_SEARCH_ENGINE_ID";

// Define the API endpoint to handle the user's input query
app.post("/api/search", async (req, res) => {
  const query = req.body.query;
  // Implement the logic to fetch top 5 URLs using the Custom Search API (Replace YOUR_CUSTOM_SEARCH_API_KEY with your actual API key)
  const customSearchApiUrl = `https://www.googleapis.com/customsearch/v1?key=${customSearchApiKey}&cx=${customSearchEngineID}&q=${query}`;

  try {
    const response = await axios.get(customSearchApiUrl);
    const top5Urls = response.data.items.slice(0, 5).map((item) => item.link);
    console.log(JSON.stringify(top5Urls));
    const textFromUrls = await getTextFromUrls(top5Urls);
    res.json(textFromUrls);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Define the API endpoint to handle the user's input query
// app.post("/api/scrappingbee", async (req, res) => {
//   const url = req.body.url;
//   const urlData = await getTextFromUrls([url]);
//   res.json(urlData);
// });

// Function to extract text from URLs using ScrapingBee API (Replace YOUR_SCRAPINGBEE_API_KEY with your actual API key)
async function getTextFromUrls(urls) {
  const scrapingBeeApiUrl = "https://app.scrapingbee.com/api/v1";

  try {
    const textRequests = urls.map(async (url) => {
      try {
        const response = await axios.get(scrapingBeeApiUrl, {
          params: {
            api_key: scrapingBeeApiKey,
            url: url,
            render_js: true,
          },
        });

        const html = response.data; // The HTML source code
        const text = convert(html); // Extract visible text from the HTML
        console.log(`Successfully scraped URL: ${url}`);
        return text;
      } catch (error) {
        console.error(`Error scraping URL (${url}):`, error.message);
        return null;
      }
    });

    const textResults = await Promise.all(textRequests);
    console.log("Extracted text from URLs:", textResults);
    return textResults;
  } catch (error) {
    console.error("Error scraping URLs:", error);
    throw new Error("Error scraping URLs");
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
