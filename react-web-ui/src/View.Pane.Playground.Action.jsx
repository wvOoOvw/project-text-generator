import React from 'react'

import Button from '@mui/material/Button'

import Imitation from './utils.imitation'

import { copy as utilsCopy } from './utils.common'

function App() {
  const clear = () => {
    Imitation.state.library = [[], [], {}]
    Imitation.state.train = ''
    Imitation.state.run = ''
    Imitation.state.message = 'Cleared'
    Imitation.dispatch()
  }

  const copy = () => {
    utilsCopy(JSON.stringify(Imitation.state.library))
    Imitation.setState(pre => { pre.message = 'Copy'; return pre })
  }

  return <>

    <div style={{ width: '100%', height: '100%', margin: 'auto', padding: 16, paddingBottom: 68, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button variant='contained' style={{ textTransform: 'none', marin: 8 }} onClick={clear}>Clear Storage</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: 8 }} onClick={copy}>Copy Library</Button>
    </div>

  </>
}

export default App