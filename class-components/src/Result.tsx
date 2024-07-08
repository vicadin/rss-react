import React from "react";
import { Pokemon } from "./types";

interface ResultProps {
  result: Pokemon;
}

const Result: React.FC<ResultProps> = ({ result }) => {
  return (
    <div>
      <h2>{result.name}</h2>
      <p>
        <a href={result.url}>{result.url}</a>
      </p>
      {result.abilities && (
        <div>
          <h3>Abilities</h3>
          <ul>
            {result.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>
        </div>
      )}
      {result.forms && (
        <div>
          <h3>Forms</h3>
          <ul>
            {result.forms.map((form, index) => (
              <li key={index}>{form.name}</li>
            ))}
          </ul>
        </div>
      )}
      {result.base_experience && (
        <div>
          <h3>Base Experience</h3>
          <p>{result.base_experience}</p>
        </div>
      )}
      {result.game_indices && (
        <div>
          <h3>Game Indices</h3>
          <ul>
            {result.game_indices.map((gameIndex, index) => (
              <li key={index}>
                {gameIndex.version.name}: {gameIndex.game_index}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Result;
