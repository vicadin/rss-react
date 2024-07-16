import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon, PokemonListResponse } from "./types";
import Result from "./Result";
import Pagination from "./Pagination";
import loaderGif from "../src/assets/loader.gif";
import useSearchQuery from "./useSearchQuery";
import { useSearchParams } from "react-router-dom";

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const ITEMS_PER_PAGE = 10;

const App: React.FC = () => {
  const [results, setResults] = useState<Pokemon[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  });

  useEffect(() => {
    fetchResults(searchQuery, currentPage);
  }, [currentPage]);

  const fetchResults = async (query: string, page: number) => {
    try {
      setError(null);
      setIsLoading(true);
      let response;
      const offset = (page - 1) * ITEMS_PER_PAGE;

      if (query.trim() === "") {
        response = await axios.get<PokemonListResponse>(
          `${API_URL}?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
        );
        setResults(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
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
        setTotalPages(1);
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
    setSearchParams({ page: "1" });
    fetchResults(searchQuery.trim(), 1);
  };

  const updatePage = (page: number) => {
    setSearchParams({ page: page.toString() });
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
      {results.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={updatePage} />
      )}
    </div>
  );
};

export default App;
