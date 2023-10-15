import React from 'react'

const Train = React.lazy(() => import('./View.Page.Content.Train'))
const Generate = React.lazy(() => import('./View.Page.Content.Generate'))

function App() {

  return <>
      <Train />
      <Generate />
  </>
}

export default App