import React from 'react'

function App(props) {
  const { tag = 'div', animation, restore, ...params } = props

  const ref = React.useRef()

  const [style, setStyle] = React.useState(animation[0])

  React.useEffect(() => {
    const option = {
      threshold: [0, 0.01, 0.05, 0.1, 0.5]
    }

    const intersectionObserver = new IntersectionObserver(en => {
      if (en[0].intersectionRatio > 0) setStyle(animation[1])
      if (restore && en[0].intersectionRatio === 0) setStyle(animation[0])
    }, option)

    intersectionObserver.observe(ref.current)

    return () => intersectionObserver.disconnect()
  }, [])

  return React.createElement(tag, { ...params, style: { ...params.style, ...style }, ref: el => ref.current = el })
}

export default App