import React from 'react'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip';

import CopyAllIcon from '@mui/icons-material/CopyAll'
import UploadIcon from '@mui/icons-material/Upload'
import DownloadIcon from '@mui/icons-material/Download'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import LineAxisIcon from '@mui/icons-material/LineAxis'
import EditIcon from '@mui/icons-material/Edit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

import Imitation from './utils.imitation'

import { copy } from './utils.common'

function App() {
  const copy_ = () => {
    copy(JSON.stringify(Imitation.state.library))
    Imitation.state.message = 'Copyed'
    Imitation.dispatch()
  }

  const upload = () => {
    var data = prompt()
    if (!data) return
    Imitation.state.library = JSON.parse(data)
    Imitation.state.message = 'Loaded'
    Imitation.dispatch()
  }

  const download = () => {

  }

  const clear = () => {
    Imitation.state.library = {}
    Imitation.state.train = ''
    Imitation.state.run = ''
    Imitation.state.message = 'Cleared'
    Imitation.dispatch()
  }

  return <Paper style={{ position: 'relative', width: '100%', height: 'fit-content', overflow: 'auto', background: 'rgba(255, 255, 255, 1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 16 }}>

    <div style={{ whiteSpace: 'nowrap' }}>
      <Tooltip title='upload'>
        <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={upload}><UploadIcon /></Button>
      </Tooltip>
      <Tooltip title='download'>
        <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={download}><DownloadIcon /></Button>
      </Tooltip>
      <Tooltip title='copy'>
        <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={copy_}><CopyAllIcon /></Button>
      </Tooltip>
      <Tooltip title='clear'>
        <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={clear}><ClearAllIcon /></Button>
      </Tooltip>
    </div>
    <div style={{ whiteSpace: 'nowrap' }}>
      <Tooltip title='example'>
        <Button variant={Imitation.state.playgroundView === 'example' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'example'; return pre })}><AccountBalanceIcon /></Button>
      </Tooltip>
      <Tooltip title='graph'>
        <Button variant={Imitation.state.playgroundView === 'graph' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'graph'; return pre })}><LineAxisIcon /></Button>
      </Tooltip>
      <Tooltip title='train'>
        <Button variant={Imitation.state.playgroundView === 'train' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'train'; return pre })}><EditIcon /></Button>
      </Tooltip>
      <Tooltip title='run'>
        <Button variant={Imitation.state.playgroundView === 'run' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'run'; return pre })}><PlayArrowIcon /></Button>
      </Tooltip>
    </div>

  </Paper>
}

export default App