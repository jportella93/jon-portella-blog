import { useContext } from 'react';
import { GameContext, gameDifficulties } from './GameContext';

const useGameContext = () => {
  const [state, setState] = useContext(GameContext);

  const resetQueuedStates = () => ({
    queuedNarratorAction: false,
  });

  function set(path, value) {
    setState((currentState) => ({
      ...currentState,
      [path]: value,
      ...(path === 'gameState' ? resetQueuedStates() : {}),
    }));
  }

  function getDifficultyIndex() {
    return [...gameDifficulties.keys()]
      .findIndex((el) => el === state.difficulty);
  }

  return {
    ...state,
    set,
    difficultyIndex: getDifficultyIndex(),
  };
};

export default useGameContext;
