import React from 'react';
import {
  GAME_CATCH_NAME, PRE_GAME_STATE_INIT_QUESTION, PRE_GAME_STATE_PRESENTATION, GAME_STATE_END, GAME_STATE_PRE_SELECT_DIFFICULTY,
} from './GameContext';
import useGameContext from './useGameContext';

const GamesIndex = ({ cancelGame }) => {
  const { gameState, narratorFinishedTalking, set } = useGameContext();

  const showQuestion = gameState === PRE_GAME_STATE_INIT_QUESTION && narratorFinishedTalking;

  const btns = [
    {
      text: "Sure, let's have fun!",
      onClick: () => {
        set('gameState', GAME_STATE_PRE_SELECT_DIFFICULTY);
        set('currentGame', GAME_CATCH_NAME);
      },
    },
    {
      text: "Nope, I'm in a hurry",
      onClick: () => {
        set('gameState', GAME_STATE_END);
        cancelGame();
      },
    },
  ];

  return (
    <>
      {showQuestion && (
        <div>
          {btns.map(({ text, onClick }) => <button key={text} onClick={onClick} type="button">{text}</button>)}
        </div>
      )}
    </>
  );
};
export default GamesIndex;
