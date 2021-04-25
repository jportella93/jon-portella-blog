import React from 'react';
import BlogWrapper from './BlogWrapper';

const BlogLayout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/blog`;

  return (
    <>
      <BlogWrapper Component="header" location={location} rootPath={rootPath} text="<>" />
      {children}
      <BlogWrapper Component="footer" location={location} rootPath={rootPath} text="</>" />
    </>
  );
};

export default BlogLayout;
