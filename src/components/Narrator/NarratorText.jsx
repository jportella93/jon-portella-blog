import React, { useLayoutEffect, useState } from 'react';
import Fade from 'react-reveal/Fade';
import useGameContext from '../games/useGameContext';

const NarratorText = () => {
  const { narratorText, showNarratorBalloon } = useGameContext();
  const [shownText, setShownText] = useState('');

  useLayoutEffect(() => {
    if (narratorText === '~') {
      setShownText('');
      return undefined;
    }
    const notShownText = narratorText.replace(shownText, '');
    const nextChar = notShownText.length > 0
      ? notShownText[0]
      : null;
    const timeout = nextChar && setTimeout(() => {
      setShownText(`${shownText}${nextChar}`);
    }, 50);

    return () => clearTimeout(timeout);
  });

  const baseStyle = {
    margin: '0 3rem',
    width: '100%',
    background: 'white',
    border: '1px solid black',
    borderRadius: '5px',
    padding: '0.5rem 2rem',
    minHeight: '3rem',
    zIndex: 1,
  };

  const style = {
    ...baseStyle
    // ...positionStyles[narratorPosition],
  };

  return (
    <Fade when={showNarratorBalloon} bottom>
      <div style={style}>{shownText}</div>
    </Fade>
  );
};

export default NarratorText;
