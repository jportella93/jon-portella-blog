import React from 'react';

const oneLineScrollerStyle = {
  overflow: 'hidden'
}

const oneLineScrollerChildrenWrapperStyle = {
  whiteSpace: 'nowrap',
  overflow: 'auto',
  display: 'block',
}

const OneLineScroller = ({ children }) => (
  <span style={oneLineScrollerStyle}>
    <span style={oneLineScrollerChildrenWrapperStyle}>
      {children}
    </span>
  </span>
);

export default OneLineScroller;
