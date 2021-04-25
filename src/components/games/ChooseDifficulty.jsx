import React from 'react';
import { gameDifficulties } from './GameContext';
import useGameContext from './useGameContext';

const ChooseDifficluty = () => {
  const { difficulty, set } = useGameContext();
  const selectId = 'difficulty-select';

  return (
    <>
      <label htmlFor={selectId}>
        Select difficulty
        <select value={difficulty} name={selectId} id={selectId} onChange={({ target: { value } }) => set('difficulty', value)}>
          {[...gameDifficulties.entries()].map(([id, { label }]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      </label>
    </>
  );
};

export default ChooseDifficluty;
