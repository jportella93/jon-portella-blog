import React from 'react';
import ProfileCard from './ProfileCard';

export const holderStyle = {
  border: '#358ccb 2px solid',
  borderRadius: '5px',
  width: '300px',
  padding: '0 1.75rem',
};

const btnsWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '1.75rem 0',
};

const btnStyle = {
  ...holderStyle,
  cursor: 'pointer',
  width: 'auto',
  background: 'white',
  padding: '0.25rem 0.5rem',
};

class User {
  constructor(name, surname, email, sport, food) {
    this.name = name;
    this.surname = surname;
    this.email = email;
  }
}

const user1 = new User('Jon', 'Portella', 'jportella93@gmail.com');
const user2 = new User('Antonio José', 'de los Santos', 'antonio_jose_santos108@outlook.com');

const Example = ({ title, description, withScrollers }) => {
  const [user, setUser] = React.useState(user1);

  return (
    <>
      <h2 id={title.split(' ').join('-').toLowerCase()}>
        {title}
      </h2>
      <p style={{ maxWidth: '500px' }}>{description}</p>
      <div style={holderStyle}>
        <div style={btnsWrapperStyle}>
          <button
            style={btnStyle}
            onClick={() => setUser(user1)}
          >
            Show user 1
          </button>
          <button
            style={btnStyle}
            onClick={() => setUser(user2)}
          >
            Show user 2
          </button>
        </div>
        <ProfileCard withScrollers={withScrollers} user={user} />
      </div>
    </>
  );
};

export default Example;
