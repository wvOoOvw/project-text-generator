import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'

import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';

import MenuIcon from '@mui/icons-material/Menu'
import ArticleIcon from '@mui/icons-material/Article'
import SettingsIcon from '@mui/icons-material/Settings'

import Animation from './View.Component.Animation'

import Imitation from './utils.imitation'

import { AutocompleteSX } from './utils.mui.sx'

import example from '../text-example/index'

function Example() {
  const [model, setModel] = React.useState()
  const [models, setModels] = React.useState(example.map(i => i.label))
  const [modelsDialog, setModelsDialog] = React.useState()

  const onChange = async () => {
    if (model === '') return

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const library = await example.find(i => i.label === model).value()

    Imitation.setState(pre => { pre.loading = pre.loading - 1; pre.library = library; pre.message = 'Loaded Library'; return pre })
  }

  return <>

    <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant='outlined' onClick={() => setModelsDialog(true)}><SettingsIcon style={{ marginRight: 4 }} />Model Example</Button>

    {
      modelsDialog ?
        <Dialog open={true} sx={{ '& .MuiDialog-paper': { width: 720, maxWidth: '100%' } }} onClose={() => setModelsDialog()} >
          <DialogTitle style={{ fontSize: 16 }}>Model</DialogTitle>
          <DialogContent dividers style={{ fontSize: 14 }}>
            <Grid container spacing={1}>

              <Grid item xs={12} style={{ marginBottom: 8 }}>
                <Autocomplete {...AutocompleteSX} fullWidth value={model} onChange={(e, v) => setModel(v)} options={models} renderInput={(params) => <TextField {...params} label='Model' />} />
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={() => { onChange(); setModel(); setModelsDialog() }}>Save</Button>
          </DialogActions>
        </Dialog >
        : null
    }

  </>
}

function Action() {
  const clear = () => {
    Imitation.state.library = null
    Imitation.state.message = 'Cleared Library'
    Imitation.dispatch()
  }

  const output = () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', JSON.stringify(Imitation.state.library))
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)

    Imitation.setState(pre => { pre.message = 'Copied Library'; return pre })
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

  const upload = (event) => {
    const file = event.target.files[0]

    const reader = new FileReader()

    reader.onload = (event) => {
      Imitation.state.library = JSON.parse(event.target.result)
      Imitation.state.message = 'Loaded Library'
      Imitation.dispatch()
    }

    reader.readAsText(file)
  }

  const input = () => {
    const library = window.prompt()

    Imitation.state.library = JSON.parse(library)
    Imitation.state.message = 'Loaded Library'
    Imitation.dispatch()
  }

  return <>
    <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant='outlined' onClick={clear}><SettingsIcon style={{ marginRight: 4 }} />Clear Storage</Button>
    <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant='outlined' onClick={input}><SettingsIcon style={{ marginRight: 4 }} />Input Library</Button>
    <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant='outlined' onClick={output}><SettingsIcon style={{ marginRight: 4 }} />Output Library</Button>
    <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant='outlined' onClick={download}><SettingsIcon style={{ marginRight: 4 }} />Download Library</Button>
    <label>
      <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant='outlined' component='div'><SettingsIcon style={{ marginRight: 4 }} />Upload Library</Button>
      <input type='file' style={{ display: 'none' }} onChange={upload}></input>
    </label>
  </>
}

function App() {
  const push = useHistory().push
  const pathname = useLocation().pathname

  const [drawer, setDrawer] = React.useState(false)

  return <>
    <Animation tag='div' restore={true} animation={[{ transform: 'translate(0, -65px)', opacity: 0 }, { transform: 'translate(0, 0)', opacity: 1 }]} style={{ padding: 16, display: 'flex', justifyContent: 'space-between', transition: '0.5s all' }} >
      <div>
        <Button variant='contained' onClick={() => { push('/'); }}>Text Generator</Button>
      </div>
      <div>
        <Button style={{ marginLeft: 8 }} variant='outlined' onClick={() => setDrawer(true)} color='primary'><MenuIcon style={{ marginRight: 4 }} />APP</Button>
      </div>
    </Animation>

    <Drawer anchor='left' open={drawer} onClose={() => setDrawer(false)} sx={{ '& .MuiPaper-root': { width: 304, height: '100%' } }} >
      <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>
        <div>
          <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant={pathname === '/train' ? 'contained' : 'outlined'} onClick={() => { push('/train'); setDrawer(false); }}><ArticleIcon style={{ marginRight: 4 }} />Train</Button>
          <Button style={{ margin: '4px 0', justifyContent: 'start' }} fullWidth variant={pathname === '/generate' ? 'contained' : 'outlined'} onClick={() => { push('/generate'); setDrawer(false); }}><ArticleIcon style={{ marginRight: 4 }} />Generate</Button>
        </div>

        <div>
          <Example />
          <Action />
        </div>
      </div>
    </Drawer>
  </>
}

export default App