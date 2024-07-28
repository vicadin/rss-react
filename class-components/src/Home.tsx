import "./App.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Result from "./Result";
import Pagination from "./Pagination";
import loaderGif from "../src/assets/loader.gif";
import { useGetPokemonsQuery, useGetPokemonByNameQuery } from "./services/pokemon";
import { RootState } from "./store";
import { useTheme } from "./ThemeContext";
import { selectItem, deselectItem } from "./slices/selectionSlice";
import ThemeSwitcher from "./ThemeSwitcher";

const ITEMS_PER_PAGE = 10;

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const detailsId = searchParams.get("details");

  const {
    data: pokemonList,
    isLoading: isLoadingPokemons,
    error: pokemonsError,
  } = useGetPokemonsQuery(currentPage);
  const {
    data: selectedPokemon,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useGetPokemonByNameQuery(detailsId || "", {
    skip: !detailsId,
  });

  const selectedItems = useSelector((state: RootState) => state.selection.selectedItems);

  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);

  const handleSearch = () => {
    localStorage.setItem("searchQuery", searchQuery.trim());
    setSearchParams({ page: "1" });
  };

  const handleSelect = (name: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), details: name });
    dispatch(selectItem(name));
  };

  const updatePage = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const closeDetails = () => {
    if (detailsId) {
      dispatch(deselectItem(detailsId));
    }
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), details: "" });
  };

  if (pokemonsError) {
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
            {isLoadingPokemons ? (
              <div className="loader">
                <img src={loaderGif} alt="Loading..." className="loader" />
              </div>
            ) : pokemonList?.results.length > 0 ? (
              pokemonList.results.map((result: any) => (
                <Result key={result.name} result={result} onSelect={handleSelect} />
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>

          {pokemonList && pokemonList.results.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(pokemonList.count / ITEMS_PER_PAGE)}
              onPageChange={updatePage}
            />
          )}
        </div>
        {detailsId && selectedPokemon && (
          <div className="details-panel">
            {isLoadingDetails ? (
              <div className="loader">
                <img src={loaderGif} alt="Loading..." />
              </div>
            ) : detailsError ? (
              <div>Error loading details: {detailsError.message}</div>
            ) : (
              <div>
                <button className="close-btn" onClick={closeDetails}>
                  Close
                </button>
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
