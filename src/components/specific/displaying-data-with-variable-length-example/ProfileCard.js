import React from 'react';
import OneLineScroller from './OneLineScroller';

const getElement = (el) => <p key={el}>{el}</p>;

const getWrappedElement = (el) => (
  <OneLineScroller key={el}>
    <p>{el}</p>
  </OneLineScroller>
);

const ProfileCard = ({
  user: {
    name, surname, email, sport, food,
  }, withScrollers,
}) => {
  const elements = [name, surname, email];

  return (
    <div>
      {elements.map((el) => (withScrollers ? getWrappedElement(el) : getElement(el)))}
    </div>
  );
};

export default ProfileCard;
