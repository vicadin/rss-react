import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Pokemon, PokemonListResponse } from "../types";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getPokemons: builder.query<PokemonListResponse, number>({
      query: (page = 1) => `pokemon?limit=10&offset=${(page - 1) * 10}`,
    }),
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
  }),
});

export const { useGetPokemonsQuery, useGetPokemonByNameQuery } = pokemonApi;
