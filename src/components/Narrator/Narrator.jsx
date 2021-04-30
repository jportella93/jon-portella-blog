import React, { useLayoutEffect } from 'react';
import { NARRATOR_POSITION_ON, PRE_GAME_STATE_INIT } from '../games/GameContext';
import useGameContext from '../games/useGameContext';
import NarratorCharacter from './NarratorCharacter';
import NarratorText from './NarratorText';

const Narrator = () => {
  const {
    set, gameState, queuedNarratorAction, narratorFinishedTalking,
  } = useGameContext();

  if (narratorFinishedTalking) alert('finished');

  const talk = async (sentences, i = 0) => {
    set('narratorFinishedTalking', false);
    const sentence = sentences[i];
    if (!sentence) return;
    setTimeout(() => {
      set('narratorText', sentence);
      setTimeout(() => {
        if (i !== sentences.length - 1) set('narratorText', '~'); // Clears text
        talk(sentences, i + 1);
        if (i === sentences.length - 1) {
          set('narratorFinishedTalking', true);
        }
      }, 3000);
    }, 500);
  };

  useLayoutEffect(() => {
    if (queuedNarratorAction) return undefined;
    let timeout;
    if (gameState === PRE_GAME_STATE_INIT) {
      timeout = setTimeout(() => {
        set('queuedNarratorAction', true);
        set('narratorPosition', NARRATOR_POSITION_ON);
        setTimeout(() => {
          set('showNarratorBalloon', true);
          talk([
            'hi there!',
            'how are you doing?',
            'Im good',
          ]);
        }, 500);
      }, 300);
    }

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
