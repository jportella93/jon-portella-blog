import React from 'react';
import Separator from '../components/Separator';
import Example, { holderStyle } from '../components/specific/displaying-data-with-variable-length-example/Example';

const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem'
};

const examples = [
  {
    description:
    `Here we have a card with a fixed width of ${holderStyle.width}.
    It looks good with the user used for the designs, but when we load user 2...
    Hmmm it seems like the text is overflowing. We didn't take this into account.`
  },
  {
    description:
    `Here we have wrapped every variable text field with our OneLineScroller.
    Now it doesn't overflow and our UI stays intact, hooray!`,
    withScrollers: true
  },
];

export default function DisplayingDataWithVariableLengthExample() {
  return (
    <div style={wrapperStyle}>
      {examples.map((exampleProps, i) => (
        <React.Fragment key={i}>
          <Example {...exampleProps} title={`Example ${i+1}`}/>
          <Separator height="10rem" />
        </React.Fragment>
      ))}
    </div>
  );
}

