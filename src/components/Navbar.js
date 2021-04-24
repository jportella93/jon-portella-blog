import { Link } from 'gatsby'
import React from 'react'

import { rhythm } from '../utils/typography'

class Navbar extends React.Component {
    render() {
        const { location, children } = this.props
        const rootPath = `${__PATH_PREFIX__}/`

        const links = [
            {
                label: 'Home',
                url: '/'
            },
            {
                label: 'Blog',
                url: '/blog'
            },
            {
                label: 'Contact',
                url: '/contact'
            }
        ]

        return (
            <nav>
                <ul style={{ display: 'flex', margin: 0 }}>
                    {links.map(({ label, url }) => (
                        <li key={url}
                            style={{ listStyle: 'none', marginRight: rhythm(0.5) }}>
                            <Link to={url}
                                style={{
                                    textDecoration: (location && location.pathname === url)
                                        ? 'line-through'
                                        : 'none'
                                }}>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        )
    }
}

export default Navbar
