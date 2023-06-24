import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Slider from '@mui/material/Slider'

import SettingsIcon from '@mui/icons-material/Settings'
import SendIcon from '@mui/icons-material/Send'

import Imitation from './utils.imitation'

import { tokenizer } from '../text-tokenizer/index'
import { generator } from '../text-generator/index'

import { tokenFormat, requestRender } from './utils.common'

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>

        <Grid item xs={12}>
          Create Token Length {props.setting.createTokenLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.createTokenLength} onChange={(e, v) => props.setSetting(pre => { pre.createTokenLength = v; return { ...pre } })} min={1} max={2048} step={1} />
        </Grid>

        <Grid item xs={12}>
          Memory Context Length {props.setting.memoryContextLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.memoryContextLength} onChange={(e, v) => props.setSetting(pre => { pre.memoryContextLength = v; return { ...pre } })} min={1} max={64} step={1} />
        </Grid>

        <Grid item xs={12}>
          Top P {props.setting.topP}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.topP} onChange={(e, v) => props.setSetting(pre => { pre.topP = v; return { ...pre } })} min={0} max={1} step={0.01} />
        </Grid>

        <Grid item xs={12}>
          Temperature {props.setting.temperature}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.temperature} onChange={(e, v) => props.setSetting(pre => { pre.temperature = v; return { ...pre } })} min={0} max={2} step={0.01} />
        </Grid>

        <Grid item xs={12}>
          Repeat Length {props.setting.repeatLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.repeatLength} onChange={(e, v) => props.setSetting(pre => { pre.repeatLength = v; return { ...pre } })} min={0} max={64} step={1} />
        </Grid>

        <Grid item xs={12}>
          Punctuation Space {props.setting.punctuationSpace}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.punctuationSpace} onChange={(e, v) => props.setSetting(pre => { pre.punctuationSpace = v; return { ...pre } })} min={0} max={64} step={1} />
        </Grid>

      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained'>{props.prompt.length}</Button>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const ref = React.useRef()
  const [prompt, setPrompt] = React.useState('')
  const [setting, setSetting] = React.useState({ createTokenLength: 1024, memoryContextLength: 4, topP: 0.9, temperature: 1.5, repeatLength: 8, repeatDistance: 1024, repeatMaxTime: 16, punctuationSpace: 8, stopToken: '' })
  const [settingDialog, setSettingDialog] = React.useState()
  const [running, setRunning] = React.useState(false)

  const generate = async (paramsSetting) => {
    const tokenizerProcessLoop = async (tokenizerProcess) => {
      const r = await new Promise(r => {
        const loop = () => tokenizerProcess.next ? requestRender()(() => { tokenizerProcess.next(); loop() }) : r(tokenizerProcess.result)

        loop()
      })

      return r
    }

    const generatorProcessLoop = async (generatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => generatorProcess.next ? requestRender()(() => { generatorProcess.next(); setPrompt([...generatorProcess.token, ...tokenFormat(generatorProcess.result, 2)].join('')); loop() }) : r(generatorProcess.result)

        loop()
      })

      return r
    }

    setRunning(true)

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    console.log(prompt)

    const token = await tokenizerProcessLoop(tokenizer(prompt))

    console.log(token)

    const result = await generatorProcessLoop(generator(token, { ...setting, ...paramsSetting }, Imitation.state.library))

    console.log(result)

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    setRunning(false)
  }

  React.useEffect(() => { if (running) ref.current.scrollTop = 100000 }, [running, prompt])

  return <>

    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 68 }} ref={el => ref.current = el} />

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={() => setSettingDialog(true)}><SettingsIcon /></Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={() => generate()}><SendIcon /></Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={() => generate({ createTokenLength: 1 })}>Next</Button>
    </div>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} prompt={prompt} />

  </>
}

export default App