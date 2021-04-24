import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

const BlogWrapper = ({ text, location, rootPath, Component = "header" }) => {

  return (
    <Component>
      <nav>
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to="/blog"
        >
          <h1
            style={{
              ...scale(1.5),
              marginBottom: rhythm(1),
              marginTop: rhythm(1),
            }}
          >
            {text}
          </h1>
        </Link>
      </nav>
    </Component>
  )
}

export default BlogWrapper;
