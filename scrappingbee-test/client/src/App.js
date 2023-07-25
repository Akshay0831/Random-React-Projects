// src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/search", {
        query,
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="query">Query: </label>
        <input
          type="text"
          id="query"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {results.length > 0 &&
        results.map((text, index) => (
          <div>
            <p className="scrapedEntry" key={index}>
              {text}
            </p>
            <hr />
          </div>
        ))}
    </div>
  );
}

export default App;
