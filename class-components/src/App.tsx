import "./App.css";
import { Component } from "react";
import axios from "axios";
import { Pokemon, PokemonListResponse } from "./types";
import Result from "./Result";
import loaderGif from "../src/assets/loader.gif";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

interface AppState {
  searchQuery: string;
  results: Pokemon[];
  error: Error | null;
  isLoading: boolean;
}

class App extends Component<Record<string, unknown>, AppState> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      searchQuery: "",
      results: [],
      error: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      this.setState({ searchQuery: savedQuery });
      this.fetchResults(savedQuery);
    } else {
      this.fetchResults("");
    }
  }

  fetchResults = async (query: string) => {
    try {
      this.setState({ error: null, isLoading: true });
      let response;
      if (query.trim() === "") {
        response = await axios.get<PokemonListResponse>(`${API_URL}?limit=10&offset=0`);
        this.setState({ results: response.data.results || [] });
      } else {
        response = await axios.get<Pokemon>(`${API_URL}/${query.trim().toLowerCase()}`);
        this.setState({
          results: [
            {
              name: response.data.name,
              url: `${API_URL}/${response.data.name}`,
              abilities: response.data.abilities,
              base_experience: response.data.base_experience,
              forms: response.data.forms,
              game_indices: response.data.game_indices,
            },
          ],
        });
      }
    } catch (err) {
      this.setState({ error: err as Error });
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearch = () => {
    localStorage.setItem("searchQuery", this.state.searchQuery.trim());
    this.fetchResults(this.state.searchQuery.trim());
  };

  render() {
    const { searchQuery, results, error, isLoading } = this.state;

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
            onChange={(e) => this.setState({ searchQuery: e.target.value })}
          />
          <button className="search-btn" onClick={this.handleSearch}>
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
  }
}

export default App;
