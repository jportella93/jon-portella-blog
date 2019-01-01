import React from 'react'

import Header from '../components/Header'
import { rhythm } from '../utils/typography'

class Layout extends React.Component {
  render() {
    const { location, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <Header location={location} rootPath={rootPath} text={'<>'}/>
        {children}
        <footer>
          <Header location={location} rootPath={rootPath} text={'</>'}/>
        </footer>
      </div>
    )
  }
}

export default Layout
