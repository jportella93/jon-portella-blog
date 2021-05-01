import React from 'react'

import BlogWrapper from './BlogWrapper'
import { rhythm } from '../utils/typography'
import Navbar from './Navbar'

class Layout extends React.Component {
  render() {
    const { location, children, maxWidth = rhythm(32) } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(32),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
        }}
      >
        <Navbar location={location} />
        <div style={{
          maxWidth,
          marginLeft: `auto`,
          marginRight: `auto`,
        }}>
          {children}
        </div>
      </div>
    )
  }
}

export default Layout
