import React from 'react'

import Paper from '@mui/material/Paper'

const Action = React.lazy(() => import('./View.Pane.Playground.Action'))
const Train = React.lazy(() => import('./View.Pane.Playground.Train'))
const Generate = React.lazy(() => import('./View.Pane.Playground.Generate'))

function App() {

  return <>

    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <Paper style={{ margin: 16 }}><Action /></Paper>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Paper style={{ width: '50%', margin: 16, position: 'relative' }}><Train /></Paper>
        <Paper style={{ width: '50%', margin: 16, position: 'relative' }}><Generate /></Paper>
      </div>

    </div>

  </>
}

export default App