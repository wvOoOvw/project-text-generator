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

function NeuronExampleDialog(props) {
  const [context, setContext] = React.useState({ sample: Imitation.state.context.neuronExample.sample, data: Imitation.state.context.neuronExample.data })

  const save = () => {
    Imitation.state.context.neuronExample.sample = context.sample
    Imitation.state.context.neuronExample.data = context.data
    Imitation.dispatch()
    props.onClose()
  }

  return <Dialog open={true} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={props.onClose}>
    <DialogTitle>
      <div style={{ fontSize: 16 }}>Example</div>
    </DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ fontSize: 14, left: 8, top: -7, position: 'absolute', background: 'white', padding: '0 4px', zIndex: 1, transformOrigin: 'left center', transform: 'scale(0.7)' }}>Sample</div>
            <TextField sx={{ '& textarea': { fontSize: 14 } }} multiline fullWidth value={context.sample} onChange={e => { setContext({ ...context, sample: e.target.value }); Imitation.dispatch() }} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ fontSize: 14, left: 8, top: -7, position: 'absolute', background: 'white', padding: '0 4px', zIndex: 1, transformOrigin: 'left center', transform: 'scale(0.7)' }}>Data</div>
            <TextField sx={{ '& textarea': { fontSize: 14 } }} multiline fullWidth value={context.sample} onChange={e => { setContext({ ...context, sample: e.target.value }); Imitation.dispatch() }} />
          </div>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={save}>Save</Button>
    </DialogActions>
  </Dialog>
}

function RunDialog(props) {
  const [context, setContext] = React.useState({ sample: Imitation.state.context.neuronExample.sample, data: Imitation.state.context.neuronExample.data })

  const run = () => {
    try { JSON.parse(context.sample) } catch { Imitation.state.message = 'Sample Format Error'; Imitation.dispatch(); return }
    Imitation.state.neuronLinkAction = null
    Imitation.state.neuronInformationAction = null
    Imitation.state.neuronMouseEnter = null
    Imitation.state.neuronLinkInformationMouseEnter = null
    Imitation.state.runLogMouseEnterArray = []
    Imitation.state.runContext = { ...context, log: [] }
    Imitation.dispatch()
    props.onClose()
  }

  return <Dialog open={true} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={props.onClose}>
    <DialogTitle>
      <div style={{ fontSize: 16 }}>Run Context</div>
    </DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ fontSize: 14, left: 8, top: -7, position: 'absolute', background: 'white', padding: '0 4px', zIndex: 1, transformOrigin: 'left center', transform: 'scale(0.7)' }}>Sample</div>
            <TextField sx={{ '& textarea': { fontSize: 14 } }} multiline fullWidth value={context.sample} onChange={e => { setContext({ ...context, sample: e.target.value }); Imitation.dispatch() }} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ fontSize: 14, left: 8, top: -7, position: 'absolute', background: 'white', padding: '0 4px', zIndex: 1, transformOrigin: 'left center', transform: 'scale(0.7)' }}>Data</div>
            <TextField sx={{ '& textarea': { fontSize: 14 } }} multiline fullWidth value={context.sample} onChange={e => { setContext({ ...context, sample: e.target.value }); Imitation.dispatch() }} />
          </div>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={run}>Run</Button>
    </DialogActions>
  </Dialog>
}

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

  const expend = () => {
    Imitation.state.infromationExpand = !Imitation.state.infromationExpand
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
      <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={expend}><ExpandIcon /></Button>
      <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={load}><UploadIcon /></Button>
      <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={save}><SaveIcon /></Button>
    </div>
    <div style={{ whiteSpace: 'nowrap' }}>
      <Button variant={Imitation.state.playgroundView === 'graph' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={graph}>Graph</Button>
      <Button variant={Imitation.state.playgroundView === 'train' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={train}>Train</Button>
      <Button variant={Imitation.state.playgroundView === 'run' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={run}>Run</Button>
    </div>
  </Paper>
}

export default App