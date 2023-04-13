import React from 'react'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import LineAxisIcon from '@mui/icons-material/LineAxis'
import EditIcon from '@mui/icons-material/Edit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import TableChartIcon from '@mui/icons-material/TableChart'

import Imitation from './utils.imitation'

function App() {

  return <>

    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <div style={{ textAlign: 'center', fontSize: 16, marginBottom: 16 }}>Text Generator Model Web</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant={Imitation.state.playgroundView === 'table' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'table'; return pre })}><TableChartIcon /></Button>
          <Button variant={Imitation.state.playgroundView === 'graph' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'graph'; return pre })}><LineAxisIcon /></Button>
          <Button variant={Imitation.state.playgroundView === 'train' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'train'; return pre })}><EditIcon /></Button>
          <Button variant={Imitation.state.playgroundView === 'run' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'run'; return pre })}><PlayArrowIcon /></Button>
        </div>
      </div>
    </div>

  </>
}

export default App