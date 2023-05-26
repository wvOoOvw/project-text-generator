import React from 'react'

function App(props) {
  const [opacity, setOpacity] = React.useState(0)

  React.useEffect(() => {
    requestAnimationFrame(() => setOpacity(1))
  }, [])

  return <div style={{ opacity: opacity, transition: '0.5s all' }}>{props.children}</div>
}


export default App