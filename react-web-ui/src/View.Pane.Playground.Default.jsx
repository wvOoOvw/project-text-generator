import React from 'react'

import Button from '@mui/material/Button'

import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import LineAxisIcon from '@mui/icons-material/LineAxis'
import EditIcon from '@mui/icons-material/Edit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import Imitation from './utils.imitation'

function App() {

  return <>

    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <div>
        <div style={{ textAlign: 'center', fontSize: 24, marginBottom: 32 }}>Text Generator Web</div>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'example'; return pre })}>
          <AccountBalanceIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 0.  </div>
          <div>preselect example model (optional)</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'train'; return pre })}>
          <EditIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 1. </div>
          <div>train your custom model</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'graph'; return pre })}>
          <LineAxisIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 2. </div>
          <div>check your model's status</div>
        </Button>
        <Button fullWidth color='inherit' style={{ textTransform: 'none', marginBottom: 16, display: 'flex', justifyContent: 'left', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'run'; return pre })}>
          <PlayArrowIcon style={{ marginRight: 8, width: 24, height: 24 }} />
          <div>Step 3. </div>
          <div>use your model</div>
        </Button>
      </div>
    </div>

  </>
}

export default App