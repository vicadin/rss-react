export interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Form {
  name: string;
  url: string;
}

export interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  name: string;
  url: string;
  abilities?: Ability[];
  base_experience?: number;
  forms?: Form[];
  game_indices?: GameIndex[];
}

export interface PokemonListResponse {
  results: Pokemon[];
}
export interface AppState {
  searchQuery: string;
  results: Pokemon[];
  error: Error | null;
  isLoading: boolean;
}
export type Theme = "light" | "dark";
export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ResultProps {
  result: Pokemon;
  onSelect: (name: string) => void;
}
