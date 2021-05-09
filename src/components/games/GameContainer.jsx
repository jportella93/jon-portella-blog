import React from 'react';
import { GameContextProvider } from './GameContext';

const GameContainer = ({children}) => {
  return (
    <GameContextProvider>
      {children}
    </GameContextProvider>
  );
}

export default GameContainer;
