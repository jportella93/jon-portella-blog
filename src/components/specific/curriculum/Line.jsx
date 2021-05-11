import React from 'react'

const Line = ({ direction, date, children }) => {
    const containerStyle = {
        margin: `0 ${direction === 'right' ? 0 : 'auto'} 0 ${direction === 'left' ? 0 : 'auto'}`,
        display: 'flex',
        flexDirection: 'column',
    }

    const contentContainerStyle = {
        margin: `0 ${direction === 'right' ? '0' : '1.5rem'} 0 ${direction === 'left' ? '0' : '1.5rem'}`,
    }

    const dateStyle = {
        width: '100%'
    }

    const bigStyle = {
        container: {
            ...containerStyle,
            width: '50%',
        },
        contentContainer: {
            ...contentContainerStyle
        },
        date: {
            ...dateStyle,
            textAlign: direction,
        }
    }

    const smallStyle = {
        container: {
            ...containerStyle,
            width: '100%',
        },
        contentContainer: {
            ...contentContainerStyle,
            margin: `0 0 0 1.5rem`,
        },
        date: {
            ...dateStyle,
            textAlign: 'left',
            margin: `0 0 0 1.5rem`,
        }
    }

    const [style, setStyle] = React.useState(bigStyle)

    React.useLayoutEffect(() => {
        if (window.innerWidth < 400) {
            setStyle(smallStyle)
        }
    }, [])

    return (
        <div style={style.container}>
            {date && <time style={style.date} dateTime={date}>{date.toLocaleDateString()}</time>}
            <div
                style={{
                    margin: '0',
                    height: '1rem',
                    background: '#358ccb',
                }} />
            <div style={style.contentContainer}>
                {children}
            </div>
        </div>
    )
}

export default Line;
