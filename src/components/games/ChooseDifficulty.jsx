import React from 'react';
import {
  gameDifficulties, GAME_PRESENTATION, GAME_STATE_POST_SELECT_DIFFICULTY, GAME_STATE_PRE_SELECT_DIFFICULTY, GAME_STATE_SELECT_DIFFICULTY, PRE_GAME_STATE_INIT, PRE_GAME_STATE_INIT_QUESTION,
} from './GameContext';
import useGameContext from './useGameContext';

const ChooseDifficluty = () => {
  const {
    difficulty, set, gameState, currentGame,
  } = useGameContext();
  const selectId = 'difficulty-select';

  const position = gameState === GAME_STATE_SELECT_DIFFICULTY
    ? 'center'
    : 'top';

  const show = currentGame !== GAME_PRESENTATION
  && (!new Set([PRE_GAME_STATE_INIT, PRE_GAME_STATE_INIT_QUESTION]).has(gameState));

  const commonStyle = {
    position: 'absolute',
    transition: 'all 0.3s ease',
  };

  const style = {
    center: {
      ...commonStyle,
      top: '50%',
      left: '20%',
    },
    top: {
      ...commonStyle,
      top: '0%',
      left: '0%',
    },
  };

  const handleSelect = ({ target: { value } }) => {
    if (gameState === GAME_STATE_SELECT_DIFFICULTY) {
      set('gameState', GAME_STATE_POST_SELECT_DIFFICULTY);
    }
    set('difficulty', value);
  };

  return show && (
  <div style={style[position]}>
    <label htmlFor={selectId}>
      Select difficulty
      <select value={difficulty || ''} name={selectId} id={selectId} onChange={handleSelect}>
        {[...gameDifficulties.entries()].map(([id, { label }]) => (
          <option key={id} value={id}>{label}</option>
        ))}
      </select>
    </label>
  </div>
  );
};

export default ChooseDifficluty;
