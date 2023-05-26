import React from 'react'

import Button from '@mui/material/Button'

import Imitation from './utils.imitation'

function App() {
  const clear = () => {
    Imitation.state.library = [[], [], {}]
    Imitation.state.train = ''
    Imitation.state.run = ''
    Imitation.state.message = 'Cleared'
    Imitation.dispatch()
  }

  const copy = () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', JSON.stringify(Imitation.state.library))
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)

    Imitation.setState(pre => { pre.message = 'Copy'; return pre })
  }

  const download = () => {
    const blob = new Blob([JSON.stringify(Imitation.state.library)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
  
    const link = document.createElement('a')
    link.href = url
    link.download = 'library.json'
    link.click()
  
    URL.revokeObjectURL(url)
  }

  return <>

    <div style={{ width: '100%', height: '100%', margin: 'auto', padding: 16, paddingBottom: 68, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: 8 }} onClick={clear}>Clear Storage</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: 8 }} onClick={copy}>Copy Library</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: 8 }} onClick={download}>Download Library</Button>
    </div>

  </>
}

export default App