import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

const Header = ({ text, location, rootPath }) => {

  const [ titleStyle, setTitleStyle ] = React.useState({
    ...scale(1.5),
    marginBottom: rhythm(1.5),
    marginTop: 0,
    textAlign: `center`,
  })

  React.useEffect(() => {
    if (window.innerWidth > 400) {
      setTitleStyle({
        ...titleStyle,
        textAlign: `initial`
      })
    }
  }, [])

  let header;
  if (location.pathname === rootPath) {
    header = (
      <h1
        style={titleStyle}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {text}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
          marginBottom: rhythm(-1),
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {text}
        </Link>
      </h3>
    )
  }

  return header
}

export default Header;
