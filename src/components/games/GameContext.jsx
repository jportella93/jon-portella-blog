import React, { useState } from 'react';

export const GAME_STATE_WAITING_FOR_START = 'waitingForStart';
export const GAME_STATE_WAITING_FOR_STARTING = 'starting';
export const GAME_STATE_STARTED = 'started';
export const GAME_STATE_JUST_WON = 'justWon';
export const GAME_STATE_WIN = 'win';
export const GAME_STATE_LOOSE = 'loose';
export const GAME_STATE_ERROR = 'error';

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

const GameContext = React.createContext();

const GameContextProvider = ({ children }) => {
  const initialState = {
    gameState: GAME_STATE_WAITING_FOR_START,
    difficulty: null,
  };

  const [state, setState] = useState(initialState);

  //   setState((currentState) => ({
  //     ...currentState,
  //     difficultyIndex: [...gameDifficulties.keys()].findIndex((el) => el === currentState.difficulty),
  //   }));
  return (
    <GameContext.Provider value={[state, setState]}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
