import React from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import LineAxisIcon from '@mui/icons-material/LineAxis'
import EditIcon from '@mui/icons-material/Edit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import Imitation from './utils.imitation'

function App() {

  return <>

    <div style={{ width: '100%', height: '100%', padding: 16, overflow: 'auto' }}>
      
      <div style={{ margin: 'auto', width: 'fit-content', padding: '32px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 16, textAlign: 'center' }}>Text Generator Web</div>
        <div style={{ fontSize: 14, textAlign: 'center' }}>For Free</div>
      </div>

      <Divider/>

      <div style={{ margin: 'auto', width: 'fit-content', padding: '32px 0' }}>
        <div style={{ fontSize: 20, marginBottom: 32, textAlign: 'center' }}>How to use</div>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'example'; return pre })}>
          <AccountBalanceIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 1.  </div>
          <div>preselect example model (optional)</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'graph'; return pre })}>
          <LineAxisIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 2. </div>
          <div>view your model's information</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'train'; return pre })}>
          <EditIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 3. </div>
          <div>train your custom model</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'run'; return pre })}>
          <PlayArrowIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 4. </div>
          <div>use your model</div>
        </Button>
      </div>

    </div>

  </>
}

export default App