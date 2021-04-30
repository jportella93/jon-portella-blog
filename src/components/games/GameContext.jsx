import React, { useState } from 'react';

export const PRE_GAME_STATE_INIT = 'PRE_GAME_STATE_INIT';
export const PRE_GAME_STATE_PRESENTATION = 'PRE_GAME_STATE_PRESENTATION';
export const GAME_STATE_WAITING_FOR_START = 'GAME_STATE_WAITING_FOR_START';
export const GAME_STATE_WAITING_FOR_STARTING = 'GAME_STATE_WAITING_FOR_STARTING';
export const GAME_STATE_STARTED = 'GAME_STATE_STARTED';
export const GAME_STATE_JUST_WON = 'GAME_STATE_JUST_WON';
export const GAME_STATE_WIN = 'GAME_STATE_WIN';
export const GAME_STATE_LOOSE = 'GAME_STATE_LOOSE';
export const GAME_STATE_ERROR = 'GAME_STATE_ERROR';

// const gameStates = new Map([
//   [
//     GAME_STATE_WAITING_FOR_START,
//     {
//       id: GAME_STATE_WAITING_FOR_START,
//     },
//   ],
//   [
//     GAME_STATE_STARTED,
//     {
//       id: GAME_STATE_STARTED,
//     },
//   ],
//   [
//     GAME_STATE_WIN,
//     {
//       id: GAME_STATE_WIN,
//     },
//   ],
//   [
//     GAME_STATE_LOOSE,
//     {
//       id: GAME_STATE_LOOSE,
//     },
//   ],
//   [
//     GAME_STATE_ERROR,
//     {
//       id: GAME_STATE_ERROR,
//     },
//   ],
// ]);

export const GAME_DIFFICULTY_1 = 'GAME_DIFFICULTY_1';
export const GAME_DIFFICULTY_2 = 'GAME_DIFFICULTY_2';
export const GAME_DIFFICULTY_3 = 'GAME_DIFFICULTY_3';
export const GAME_DIFFICULTY_4 = 'GAME_DIFFICULTY_4';
export const GAME_DIFFICULTY_5 = 'GAME_DIFFICULTY_5';

export const gameDifficulties = new Map([
  [
    GAME_DIFFICULTY_1,
    {
      id: GAME_DIFFICULTY_1,
      label: 'Grandma Muriel',
    },
  ],
  [
    GAME_DIFFICULTY_2,
    {
      id: GAME_DIFFICULTY_2,
      label: 'I can Internet',
    },
  ],
  [
    GAME_DIFFICULTY_3,
    {
      id: GAME_DIFFICULTY_3,
      label: 'Working in Tech',
    },
  ],
  [
    GAME_DIFFICULTY_4,
    {
      id: GAME_DIFFICULTY_4,
      label: 'Twitch streamer',
    },
  ],
  [
    GAME_DIFFICULTY_5,
    {
      id: GAME_DIFFICULTY_5,
      label: 'Just destroy my ego',
    },
  ],
]);

export const NARRATOR_POSITION_ON = 'NARRATOR_POSITION_ON';
export const NARRATOR_POSITION_OFF = 'NARRATOR_POSITION_OFF';

const GameContext = React.createContext();

const GameContextProvider = ({ children }) => {
  const [state, setState] = useState({
    gameState: PRE_GAME_STATE_INIT,
    difficulty: null,
    narratorPosition: NARRATOR_POSITION_OFF,
    narratorText: '',
    narratorFinishedTalking: false,
    showNarratorBalloon: false,
    queuedNarratorAction: false,
  });

  return (
    <GameContext.Provider value={[state, setState]}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
