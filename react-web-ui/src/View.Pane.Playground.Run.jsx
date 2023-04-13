import React from 'react'

import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';

import SendIcon from '@mui/icons-material/Send'
import SettingsIcon from '@mui/icons-material/Settings'

import Imitation from './utils.imitation'

import { tokenizer } from '../text-tokenizer/index'
import { generator } from '../text-generator/index'

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Create Token Length {props.setting.createTokenLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.createTokenLength} onChange={(e, v) => props.setSetting(pre => { pre.createTokenLength = v; return { ...pre } })} min={1} max={1024} step={1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Memory Context {props.setting.memoryContext}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.memoryContext} onChange={(e, v) => props.setSetting(pre => { pre.memoryContext = v; return { ...pre } })} min={1} max={10} step={1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          To Top {props.setting.toTop}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.toTop} onChange={(e, v) => props.setSetting(pre => { pre.toTop = v; return { ...pre } })} min={0} max={1} step={0.01} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Temperature {props.setting.temperature}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.temperature} onChange={(e, v) => props.setSetting(pre => { pre.temperature = v; return { ...pre } })} min={0} max={2} step={0.01} />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const [prompt, setPrompt] = React.useState('')
  const [setting, setSetting] = React.useState({ createTokenLength: 64, memoryContext: 2, toTop: 1, temperature: 1 })
  const [settingDialog, setSettingDialog] = React.useState()

  const run = async () => {

    const tokenizerProcessLoop = async (tokenizerProcess) => {
      const r = await new Promise(r => {
        const loop = () => tokenizerProcess.next ? requestIdleCallback(() => { tokenizerProcess.next(); loop() }) : r(tokenizerProcess.result)

        loop()
      })

      return r
    }

    const generatorProcessLoop = async (generatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => generatorProcess.next ? requestIdleCallback(() => { generatorProcess.next(); setPrompt(pre => pre + generatorProcess.result[generatorProcess.result.length - 1]); loop() }) : r(generatorProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    console.log(prompt)

    const token = await tokenizerProcessLoop(tokenizer(prompt))

    console.log(token)

    const result = await generatorProcessLoop(generator(token, setting, Imitation.state.library))

    console.log(result)

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
  }

  return <>

    <Paper style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 1)', position: 'relative' }}>

      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', fontSize: 14, lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 64 }} />

      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
        <Button variant='contained' style={{ margin: '0 4px' }} onClick={run}><SendIcon /></Button>
        <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setSettingDialog(true)}><SettingsIcon /></Button>
      </div>

    </Paper>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />

  </>
}

export default App