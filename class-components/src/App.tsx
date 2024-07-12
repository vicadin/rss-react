import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon, PokemonListResponse } from "./types";
import Result from "./Result";
import loaderGif from "../src/assets/loader.gif";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<Pokemon[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      setSearchQuery(savedQuery);
      fetchResults(savedQuery);
    } else {
      fetchResults("");
    }
  }, []);

  const fetchResults = async (query: string) => {
    try {
      setError(null);
      setIsLoading(true);
      let response;
      if (query.trim() === "") {
        response = await axios.get<PokemonListResponse>(`${API_URL}?limit=10&offset=0`);
        setResults(response.data.results || []);
      } else {
        response = await axios.get<Pokemon>(`${API_URL}/${query.trim().toLowerCase()}`);
        setResults([
          {
            name: response.data.name,
            url: `${API_URL}/${response.data.name}`,
            abilities: response.data.abilities,
            base_experience: response.data.base_experience,
            forms: response.data.forms,
            game_indices: response.data.game_indices,
          },
        ]);
      }
    } catch (err) {
      setError(err as Error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    localStorage.setItem("searchQuery", searchQuery.trim());
    fetchResults(searchQuery.trim());
  };

  if (error) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <button
          className="error-btn"
          onClick={() => {
            throw new Error("Error!");
          }}
        >
          Throw Error
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="search-panel">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="result">
        {isLoading ? (
          <div className="loader">
            <img src={loaderGif} alt="Loading..." className="loader" />
          </div>
        ) : results.length > 0 ? (
          results.map((result: Pokemon) => <Result key={result.name} result={result} />)
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
