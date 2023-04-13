import React from 'react'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import SaveIcon from '@mui/icons-material/Save'
import UploadIcon from '@mui/icons-material/Upload'
import LineAxisIcon from '@mui/icons-material/LineAxis'
import EditIcon from '@mui/icons-material/Edit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import TableChartIcon from '@mui/icons-material/TableChart'

import Imitation from './utils.imitation'
import { copy } from './utils.common'

function App() {
  const save = () => {
    copy(JSON.stringify(Imitation.state.library))
    Imitation.state.message = 'Copyed'
    Imitation.dispatch()
  }

  const load = () => {
    var data = prompt()
    if (!data) return
    Imitation.state.library = JSON.parse(data)
    Imitation.state.message = 'Loaded'
    Imitation.dispatch()
  }

  return <Paper style={{ position: 'relative', width: '100%', height: 'fit-content', overflow: 'auto', background: 'rgba(255, 255, 255, 1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 16 }}>

    <div style={{ whiteSpace: 'nowrap' }}>
      <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={load}><UploadIcon /></Button>
      <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={save}><SaveIcon /></Button>
    </div>
    <div style={{ whiteSpace: 'nowrap' }}>
      <Button variant={Imitation.state.playgroundView === 'table' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'table'; return pre })}><TableChartIcon /></Button>
      <Button variant={Imitation.state.playgroundView === 'graph' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'graph'; return pre })}><LineAxisIcon /></Button>
      <Button variant={Imitation.state.playgroundView === 'train' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'train'; return pre })}><EditIcon /></Button>
      <Button variant={Imitation.state.playgroundView === 'run' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'run'; return pre })}><PlayArrowIcon /></Button>
    </div>
  </Paper>
}

export default App