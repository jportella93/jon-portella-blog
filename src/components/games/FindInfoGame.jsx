import React,
{
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import Narrator from '../Narrator/Narrator';
import CatchName from './CatchName/CatchName';
import ChooseDifficluty from './ChooseDifficulty';
import { GameContextProvider } from './GameContext';

const FindInfoGame = () => (
  <>
    <GameContextProvider>
      <ChooseDifficluty />
      <CatchName />
      <Narrator />
    </GameContextProvider>
  </>
);

export default FindInfoGame;
