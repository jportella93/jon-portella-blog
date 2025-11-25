import React from 'react';
import OneLineScroller from './OneLineScroller';

interface User {
  name: string;
  surname: string;
  email: string;
  sport?: string;
  food?: string;
}

interface ProfileCardProps {
  user: User;
  withScrollers?: boolean;
}

const getElement = (el: string) => <p key={el}>{el}</p>

const getWrappedElement = (el: string) => (
  <OneLineScroller key={el}>
    <p>{el}</p>
  </OneLineScroller>
)

const ProfileCard = ({ user: { name, surname, email }, withScrollers }: ProfileCardProps) => {
  const elements = [name, surname, email]

  return (
    <div>
      {elements.map(el => withScrollers ? getWrappedElement(el) : getElement(el))}
    </div>
  )
}

export default ProfileCard;






