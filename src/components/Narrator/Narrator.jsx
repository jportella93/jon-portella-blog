import React, { useLayoutEffect } from 'react';
import {
  GAME_CATCH_NAME,
  GAME_PRESENTATION, GAME_STATE_SELECT_DIFFICULTY, GAME_STATE_PRE_SELECT_DIFFICULTY, GAME_STATE_WAITING_FOR_START, NARRATOR_POSITION_ON, PRE_GAME_STATE_INIT, PRE_GAME_STATE_INIT_QUESTION, PRE_GAME_STATE_PRESENTATION, GAME_STATE_POST_SELECT_DIFFICULTY,
} from '../games/GameContext';
import useGameContext from '../games/useGameContext';
import NarratorCharacter from './NarratorCharacter';
import NarratorText from './NarratorText';

const Narrator = () => {
  const {
    set, gameState, queuedNarratorAction, currentGame,
  } = useGameContext();

  const clearText = () => {
    set('narratorText', '~'); // Clears text
  };

  const talk = async ({ text, i = 0, cb }) => {
    if (i === 0) {
      clearText();
      set('queuedNarratorAction', true);
      set('narratorPosition', NARRATOR_POSITION_ON);
      set('showNarratorBalloon', true);
      set('narratorFinishedTalking', false);
    }
    const sentence = text[i];
    if (!sentence) return;
    setTimeout(() => {
      set('narratorText', sentence);
      setTimeout(() => {
        if (i !== text.length - 1) clearText();
        talk({ text, i: i + 1, cb });
        if (i === text.length - 1) {
          set('narratorFinishedTalking', true);
          set('queuedNarratorAction', false);
          cb();
        }
      }, 3000);
    }, 500);
  };

  useLayoutEffect(() => {
    if (queuedNarratorAction) return undefined;
    let timeout;
    if (gameState === PRE_GAME_STATE_INIT && currentGame === GAME_PRESENTATION) {
      timeout = setTimeout(() => {
        setTimeout(() => {
          set('showNarratorBalloon', true);
          talk({
            text: [
              // 'hi there!',
              // 'how are you doing?',
              'would you like to play a game?',
            ],
            cb: () => {
              set('gameState', PRE_GAME_STATE_INIT_QUESTION);
              // set('showNarratorBalloon', false);
            },
          });
        }, 500);
      }, 300);
    } else if (gameState === GAME_STATE_PRE_SELECT_DIFFICULTY) {
      timeout = setTimeout(() => {
        clearText();
        setTimeout(() => {
          talk({
            text: [
              'Cool! Pick the difficulty?',
            ],
            cb: () => {
              set('gameState', GAME_STATE_SELECT_DIFFICULTY);
            },
          });
        }, 500);
      }, 300);
    } else if (gameState === GAME_STATE_POST_SELECT_DIFFICULTY) {
      timeout = setTimeout(() => {
        setTimeout(() => {
          talk({
            text: [
              'Good, you can change it at any time',
            ],
            cb: () => {
              set('gameState', PRE_GAME_STATE_PRESENTATION);
            },
          });
        }, 500);
      }, 300);
    } else if (gameState === PRE_GAME_STATE_PRESENTATION && currentGame === GAME_CATCH_NAME) {
      timeout = setTimeout(() => {
        set('queuedNarratorAction', true);
        setTimeout(() => {
          set('showNarratorBalloon', true);
          talk({
            text: [
              'Cool!',
              'I don\'t think you caught my name yet',
              'Go for it!',
            ],
            cb: () => {
              set('gameState', GAME_STATE_WAITING_FOR_START);
              set('showNarratorBalloon', false);
              set('showNarrator', false);
            },
          });
        }, 500);
      }, 300);
    }
    // else if (gameState === PRE_GAME_STATE_INIT_QUESTION) {
    //   timeout = setTimeout(() => {
    //     set('queuedNarratorAction', true);
    //     setTimeout(() => {
    //       talk([
    //         'hi there!',
    //         'how are you doing?',
    //         'would you like to play a game?',
    //       ]);
    //       set('gameState', PRE_GAME_STATE_INIT_QUESTION)
    //     }, 500);
    //   }, 300);
    // }

    return () => {
      clearTimeout(timeout);
    };
  });

  const wrapperStyle = {
    position: 'fixed',
    bottom: 0,
    height: 'min(300px, 20%)',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '0 1rem',
  };

  return (
    <div style={wrapperStyle}>
      <NarratorCharacter />
      <NarratorText />
    </div>
  );
};

// Narrator.propTypes = {
//   position: PropTypes.oneOf(Object.keys(positionStyles)).isRequired,
// };

export default Narrator;
