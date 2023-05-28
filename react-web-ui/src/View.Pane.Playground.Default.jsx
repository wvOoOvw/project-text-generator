import React from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import Imitation from './utils.imitation'

function App() {

  return <>

    <div style={{ width: '100%', height: '100%', padding: 16, overflow: 'auto' }}>

      <div style={{ margin: 'auto', width: 'fit-content', padding: '48px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 16, textAlign: 'center' }}>Text Generator Web</div>
        <div style={{ textAlign: 'center' }}>For Free</div>
      </div>

      <Divider />

      <div style={{ margin: 'auto', width: 'fit-content', padding: '48px 0' }}>
        <div style={{ fontSize: 20, marginBottom: 32, textAlign: 'center' }}>How to use</div>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'Example'; return pre })}>
          <div>Step 1. preselect example model (optional)</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'Information'; return pre })}>
          <div>Step 2. view your model's information</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'Train'; return pre })}>
          <div>Step 3. train your custom model</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'Generate'; return pre })}>
          <div>Step 4. use your model to generate text</div>
        </Button>
      </div>

      <Divider />



    </div>

  </>
}

export default App