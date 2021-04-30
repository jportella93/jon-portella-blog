import React from 'react';
import Cat from '../../../content/assets/cat.svg';
import { NARRATOR_POSITION_OFF, NARRATOR_POSITION_ON } from '../games/GameContext';
import useGameContext from '../games/useGameContext';

const positionStyles = {
  [NARRATOR_POSITION_OFF]: {
    left: '-100%',
  },
  [NARRATOR_POSITION_ON]: {
    left: 0,
  },
};

const NarratorCharacter = () => {
  const { narratorPosition } = useGameContext();
  const baseStyle = {
    transition: 'all 1s ease',
    maxHeight: '100%',
    maxWidth: '25%',
    zIndex: 2,
    background: 'white',
    position: 'relative',
  };

  const narratorStyle = {
    ...baseStyle,
    ...positionStyles[narratorPosition],
  };

  return (
    <img src={Cat} style={narratorStyle} alt="Narrator" />
  );
};

export default NarratorCharacter;
