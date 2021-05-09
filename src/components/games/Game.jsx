import React from 'react';
import Narrator from '../Narrator/Narrator';
import CatchName from './CatchName/CatchName';
import ChooseDifficluty from './ChooseDifficulty';
import { GAME_CATCH_NAME, GAME_PRESENTATION } from './GameContext';
import GamesIndex from './GamesIndex';
import useGameContext from './useGameContext';

const Game = ({ cancelGame }) => {
  const { currentGame, gameState } = useGameContext();

  let GameComponent;
  switch (currentGame) {
    case GAME_PRESENTATION:
      GameComponent = <GamesIndex cancelGame={cancelGame} />;
      break;
    case GAME_CATCH_NAME:
      GameComponent = <CatchName />;
      break;

    default:
      break;
  }

  return (
    <>
      <ChooseDifficluty />
      {GameComponent}
      <Narrator />
      <pre style={{
        margin: 0,
        position: 'fixed',
        bottom: 0,
      }}
      >
        {gameState}
        {'--'}
        {currentGame}
      </pre>
      <button
        style={{
          margin: 0,
          position: 'fixed',
          bottom: 0,
          right: 0,
        }}
        onClick={cancelGame}
        type="button"
      >
        ❌🕹
      </button>
    </>
  );
};

export default Game;
