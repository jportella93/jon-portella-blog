/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import React, {
  useLayoutEffect,
  useState,
} from 'react';
import Fade from 'react-reveal/Fade';
import { GAME_STATE_JUST_WON, GAME_STATE_STARTED, GAME_STATE_WAITING_FOR_START } from '../GameContext';
import useGameContext from '../useGameContext';

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max, rounded) {
  const rand = Math.random() * (max - min) + min;
  return rounded ? Math.floor(rand) : rand;
}

class DifficultyModifier {
  constructor({ transition = 1, refresh = 1 } = {}) {
    this.transitionMod = transition;
    this.refreshMod = refresh;
  }
}
const difficultyModifiers = [
  new DifficultyModifier({ transition: 1, refresh: 1 }),
  new DifficultyModifier({ transition: 0.6, refresh: 0.6 }),
  new DifficultyModifier({ transition: 0.4, refresh: 0.4 }),
  new DifficultyModifier({ transition: 0.2, refresh: 0.2 }),
  new DifficultyModifier({ transition: 0.1, refresh: 0.1 }),
];

const Name = ({ position }) => {
  const { difficultyIndex, set, gameState } = useGameContext();
  const { transitionMod, refreshMod } = difficultyModifiers[difficultyIndex]
      || new DifficultyModifier();

  const getRandomTop = () => getRandomInt(0, window.innerHeight - 100, true);
  const getRandomLeft = () => getRandomInt(0, window.innerWidth - 100, true);
  const getRandomFontSize = () => getRandomInt(6, 50);
  //   const getRandomRotation3d = () => [
  //     getRandomInt(0, 360), // , 1, // getRandomInt(0, 360, true),
  //   ];
  const getRandomTransition = () => getRandomInt(1 * transitionMod, 2 * transitionMod);
  const [top, setTop] = useState(getRandomTop());
  const [left, setLeft] = useState(getRandomLeft());
  const [fontSize, setFontSize] = useState(getRandomFontSize());
  //   const [rotation3d, setRotation3d] = useState(getRandomRotation3d());
  const [transition, setTransition] = useState(getRandomTransition());

  useLayoutEffect(() => {
    const timeout = position === 'random' && setTimeout(() => {
      setTop(getRandomTop());
      setLeft(getRandomLeft());
      setFontSize(getRandomFontSize());
      //   setRotation3d(getRandomRotation3d());
      setTransition(getRandomTransition());
    }, getRandomInt(1000 * refreshMod, 2000 * refreshMod, true));

    return () => clearTimeout(timeout);
  });

  const propSelectableStyles = {
    random: {
      top,
      left,
      fontSize,
      cursor: 'pointer',
      // transform: `rotate(${rotation3d}deg)`,
    },
    center: {
      top: '50%',
      left: '50%',
      fontSize: '32px',
    },
  };

  const styles = {
    position: 'fixed',
    whiteSpace: 'nowrap',
    transition: `all ${transition}s ease`,
    ...propSelectableStyles[position],
  };

  const name = new Set([GAME_STATE_WAITING_FOR_START, GAME_STATE_STARTED]).has(gameState)
    ? 'My name'
    : 'Jon Portella';

  return (
    <span
      style={styles}
      onClick={() => position === 'random' && set('gameState', GAME_STATE_JUST_WON)}
    >
      <Fade>{name}</Fade>
    </span>
  );
};

Name.propTypes = {
  position: PropTypes.oneOf(['center', 'random']).isRequired,
};

export default Name;
