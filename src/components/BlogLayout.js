import React from 'react'

import BlogWrapper from './BlogWrapper'
import { rhythm } from '../utils/typography'

class BlogLayout extends React.Component {
  render() {
    const { location, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/blog`

    return (
      <>
        <BlogWrapper Component="header" location={location} rootPath={rootPath} text={'<>'} />
        {children}
        <BlogWrapper Component="footer" location={location} rootPath={rootPath} text={'</>'} />
      </>
    )
  }
}

export default BlogLayout
