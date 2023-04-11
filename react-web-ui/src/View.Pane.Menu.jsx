import React from 'react'

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import SaveIcon from '@mui/icons-material/Save'
import UploadIcon from '@mui/icons-material/Upload'
import ExpandIcon from '@mui/icons-material/Expand'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import DataArrayIcon from '@mui/icons-material/DataArray'
import SendIcon from '@mui/icons-material/Send'

import Imitation from './utils.imitation'
import { copy } from './utils.common'

function App() {
  const save = () => {
    copy(JSON.stringify(Imitation.state.context))
    Imitation.state.message = 'Copyed'
    Imitation.dispatch()
  }

  const load = () => {
    var data = prompt()
    if (!data) return
    Imitation.state.context = JSON.parse(data)
    Imitation.state.message = 'Loaded'
    Imitation.dispatch()
  }

  const table = () => {
    Imitation.state.playgroundView = 'table'
    Imitation.dispatch()
  }

  const graph = () => {
    Imitation.state.playgroundView = 'graph'
    Imitation.dispatch()
  }

  const train = () => {
    Imitation.state.playgroundView = 'train'
    Imitation.dispatch()
  }

  const run = () => {
    Imitation.state.playgroundView = 'run'
    Imitation.dispatch()
  }

  return <Paper style={{ position: 'relative', width: '100%', height: 'fit-content', overflow: 'auto', background: 'rgba(255, 255, 255, 1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 16 }}>

    <div style={{ whiteSpace: 'nowrap' }}>
      <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={load}><UploadIcon /></Button>
      <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={save}><SaveIcon /></Button>
    </div>
    <div style={{ whiteSpace: 'nowrap' }}>
      <Button variant={Imitation.state.playgroundView === 'table' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={table}>Table</Button>
      <Button variant={Imitation.state.playgroundView === 'graph' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={graph}>Graph</Button>
      <Button variant={Imitation.state.playgroundView === 'train' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={train}>Train</Button>
      <Button variant={Imitation.state.playgroundView === 'run' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={run}>Run</Button>
    </div>
  </Paper>
}

export default App