import React from "react";

const oneLineScrollerStyle: React.CSSProperties = {
  overflow: "hidden",
};

const oneLineScrollerChildrenWrapperStyle: React.CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "auto",
  display: "block",
};

interface OneLineScrollerProps {
  children: React.ReactNode;
}

const OneLineScroller = ({ children }: OneLineScrollerProps) => (
  <span style={oneLineScrollerStyle}>
    <span style={oneLineScrollerChildrenWrapperStyle}>{children}</span>
  </span>
);

export default OneLineScroller;
