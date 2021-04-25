import { useContext } from 'react';
import { GameContext, gameDifficulties } from './GameContext';

const useGameContext = () => {
  const [state, setState] = useContext(GameContext);

  function set(path, value) {
    setState((currentState) => ({ ...currentState, [path]: value }));
  }

  function getDifficultyIndex() {
    return [...gameDifficulties.keys()]
      .findIndex((el) => el === state.difficulty);
  }

  return {
    gameState: state.gameState,
    set,
    difficultyIndex: getDifficultyIndex(),
  };
};

export default useGameContext;
