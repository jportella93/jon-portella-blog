import React, { useEffect, useLayoutEffect } from 'react';
import { GAME_STATE_JUST_WON, GAME_STATE_STARTED, GAME_STATE_WAITING_FOR_START } from '../GameContext';
import useGameContext from '../useGameContext';
import Name from './Name';

const CatchName = () => {
  const { gameState, set } = useGameContext();
  const showName = [
    GAME_STATE_STARTED, GAME_STATE_JUST_WON, GAME_STATE_WAITING_FOR_START,
  ].includes(gameState);

  //   TODO: make phase advancer here, where neame changes to my name
  // useLayoutEffect(() => {
  //   const timeout = gameState === GAME_STATE_JUST_WON &&

  // })

  return (
    <>
      {gameState === GAME_STATE_WAITING_FOR_START && (
        <button type="button" onClick={() => set('gameState', GAME_STATE_STARTED)}>Start</button>
      )}
      {showName && <Name position={gameState === GAME_STATE_STARTED ? 'random' : 'center'} />}
    </>
  );
};

export default CatchName;
