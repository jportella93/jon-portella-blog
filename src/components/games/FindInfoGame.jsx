import React,
{
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import CatchName from './CatchName/CatchName';
import ChooseDifficluty from './ChooseDifficulty';
import { GameContextProvider } from './GameContext';

const FindInfoGame = () => (
  <>
    <GameContextProvider>
      <ChooseDifficluty />
      <CatchName />
    </GameContextProvider>
  </>
);

export default FindInfoGame;
