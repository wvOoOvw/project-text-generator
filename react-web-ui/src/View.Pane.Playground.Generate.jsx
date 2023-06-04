import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'

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
        <Tooltip title='more setting will create more content'>
          <Grid item xs={12}>
            <Slider value={props.setting.createTokenLength} onChange={(e, v) => props.setSetting(pre => { pre.createTokenLength = v; return { ...pre } })} min={1} max={2048} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Memory Context Length {props.setting.memoryContextLength}
        </Grid>
        <Tooltip title='more setting will create more coherent statements content'>
          <Grid item xs={12}>
            <Slider value={props.setting.memoryContextLength} onChange={(e, v) => props.setSetting(pre => { pre.memoryContextLength = v; return { ...pre } })} min={1} max={16} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Memory Context Auxiliary Length {props.setting.memoryContextAuxiliaryLength}
        </Grid>
        <Tooltip title='more setting will create more coherent statements content, if set 1 will not auxiliary'>
          <Grid item xs={12}>
            <Slider value={props.setting.memoryContextAuxiliaryLength} onChange={(e, v) => props.setSetting(pre => { pre.memoryContextAuxiliaryLength = v; return { ...pre } })} min={1} max={16} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Memory Diff Length {props.setting.memoryDiffLength}
        </Grid>
        <Tooltip title='more setting will create more coherent statements content'>
          <Grid item xs={12}>
            <Slider value={props.setting.memoryDiffLength} onChange={(e, v) => props.setSetting(pre => { pre.memoryDiffLength = v; return { ...pre } })} min={1} max={256} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          To Top {props.setting.toTop}
        </Grid>
        <Tooltip title='more setting will create more random changes'>
          <Grid item xs={12}>
            <Slider value={props.setting.toTop} onChange={(e, v) => props.setSetting(pre => { pre.toTop = v; return { ...pre } })} min={0} max={1} step={0.01} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Temperature {props.setting.temperature}
        </Grid>
        <Tooltip title='more setting will create more random changes'>
          <Grid item xs={12}>
            <Slider value={props.setting.temperature} onChange={(e, v) => props.setSetting(pre => { pre.temperature = v; return { ...pre } })} min={0} max={2} step={0.01} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Repeat Length {props.setting.repeatLength}
        </Grid>
        <Tooltip title='check duplicate token lengths, suggest setting a length greater than 8, 0 will not check'>
          <Grid item xs={12}>
            <Slider value={props.setting.repeatLength} onChange={(e, v) => props.setSetting(pre => { pre.repeatLength = v; return { ...pre } })} min={0} max={32} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Repeat Distance {props.setting.repeatDistance}
        </Grid>
        <Tooltip title='check duplicate token distance'>
          <Grid item xs={12}>
            <Slider value={props.setting.repeatDistance} onChange={(e, v) => props.setSetting(pre => { pre.repeatDistance = v; return { ...pre } })} min={0} max={2048} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Repeat Max Time {props.setting.repeatMaxTime}
        </Grid>
        <Tooltip title='repeat over max time will stop generator'>
          <Grid item xs={12}>
            <Slider value={props.setting.repeatMaxTime} onChange={(e, v) => props.setSetting(pre => { pre.repeatMaxTime = v; return { ...pre } })} min={1} max={64} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12}>
          Punctuation Space {props.setting.punctuationSpace}
        </Grid>
        <Tooltip title='spacing between punctuation mark'>
          <Grid item xs={12}>
            <Slider value={props.setting.punctuationSpace} onChange={(e, v) => props.setSetting(pre => { pre.punctuationSpace = v; return { ...pre } })} min={0} max={64} step={1} />
          </Grid>
        </Tooltip>
        {/* <Grid item xs={12}>
          Stop Token
        </Grid>
        <Tooltip title='when encountering stop token will stop generator'>
          <Grid item xs={12}>
            <TextField autoComplete='off' fullWidth variant='standard' value={props.setting.stopToken} onChange={e => props.setSetting(pre => { pre.stopToken = e.target.value; return { ...pre } })} />
          </Grid>
        </Tooltip> */}
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const ref = React.useRef()
  const [prompt, setPrompt] = React.useState('')
  const [setting, setSetting] = React.useState({ createTokenLength: 1024, memoryContextLength: 4, memoryContextAuxiliaryLength: 4, memoryDiffLength: 64, toTop: 0.9, temperature: 1, repeatLength: 8, repeatDistance: 1024, repeatMaxTime: 16, punctuationSpace: 8, stopToken: '' })
  const [settingDialog, setSettingDialog] = React.useState()
  const [running, setRunning] = React.useState(false)

  const generate = async () => {
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

    const result = await generatorProcessLoop(generator(token, setting, Imitation.state.library))

    console.log(result)

    setRunning(false)
    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
  }

  React.useEffect(() => {
    if (running) ref.current.scrollTop = 10000
  }, [running, prompt])

  return <>

    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 68 }} ref={el => ref.current = el} />

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={() => setSettingDialog(true)}>Setting</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={generate}>Generate</Button>
    </div>

    <div style={{ position: 'absolute', left: 16, bottom: 16, fontSize: 12 }}>{prompt.length}</div>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />

  </>
}

export default App