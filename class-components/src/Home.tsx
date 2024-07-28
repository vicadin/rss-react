import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon, PokemonListResponse } from "./types";
import Result from "./Result";
import Pagination from "./Pagination";
import loaderGif from "../src/assets/loader.gif";
import useSearchQuery from "./useSearchQuery";
import { useSearchParams } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTheme } from "./ThemeContext";

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const ITEMS_PER_PAGE = 10;

const Home: React.FC = () => {
  const [results, setResults] = useState<Pokemon[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const detailsId = searchParams.get("details");

  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);

  useEffect(() => {
    fetchResults(searchQuery, currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (detailsId) {
      fetchDetails(detailsId);
    }
  }, [detailsId]);

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

  const fetchDetails = async (name: string) => {
    try {
      setDetailsLoading(true);
      const response = await axios.get<Pokemon>(`${API_URL}/${name}`);
      setSelectedPokemon(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSearch = () => {
    localStorage.setItem("searchQuery", searchQuery.trim());
    setSearchParams({ page: "1" });
    fetchResults(searchQuery.trim(), 1);
  };

  const handleSelect = (name: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), details: name });
  };

  const updatePage = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const closeDetails = () => {
    setSelectedPokemon(null);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("details");
    setSearchParams(newSearchParams);
  };

  if (error) {
    return (
      <div className={`theme-${theme}`}>
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
    <div className={`theme-${theme}`}>
      <div className="header">
        <ThemeSwitcher />
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
      </div>
      <div className="main-container">
        <div className="left-side">
          <div className="result">
            {isLoading ? (
              <div className="loader">
                <img src={loaderGif} alt="Loading..." className="loader" />
              </div>
            ) : results.length > 0 ? (
              results.map((result: Pokemon) => (
                <Result key={result.name} result={result} onSelect={handleSelect} />
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>

          {results.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={updatePage}
            />
          )}
        </div>
        {selectedPokemon && (
          <div className="details-panel">
            {detailsLoading ? (
              <div className="loader">
                <img src={loaderGif} alt="Loading..." className="loader" />
              </div>
            ) : (
              <div>
                <button className="close-btn" onClick={closeDetails}>Close</button>
                <h2>{selectedPokemon.name}</h2>
                <p>Base Experience: {selectedPokemon.base_experience}</p>
                <h3>Abilities</h3>
                <ul>
                  {selectedPokemon.abilities.map((ability, index) => (
                    <li key={index}>{ability.ability.name}</li>
                  ))}
                </ul>
                <h3>Forms</h3>
                <ul>
                  {selectedPokemon.forms.map((form, index) => (
                    <li key={index}>{form.name}</li>
                  ))}
                </ul>
                <h3>Game Indices</h3>
                <ul>
                  {selectedPokemon.game_indices.map((gameIndex, index) => (
                    <li key={index}>
                      {gameIndex.version.name}: {gameIndex.game_index}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
