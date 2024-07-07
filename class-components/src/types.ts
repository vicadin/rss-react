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
