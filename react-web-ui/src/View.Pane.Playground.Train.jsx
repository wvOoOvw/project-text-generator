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

import { tokenFormat, requestRender, requestCallback } from './utils.common'

import { tokenizer } from '../text-tokenizer/index'
import { calculator } from '../text-calculator/index'

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>

        <Grid item xs={12}>
          vectorsDimensions {props.setting.vectorsDimensions}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.vectorsDimensions} onChange={(e, v) => props.setSetting(pre => { pre.vectorsDimensions = v; return { ...pre } })} min={0} max={200} step={1} />
        </Grid>

        <Grid item xs={12}>
          vectorsWindows {props.setting.vectorsWindows}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.vectorsWindows} onChange={(e, v) => props.setSetting(pre => { pre.vectorsWindows = v; return { ...pre } })} min={1} max={32} step={1} />
        </Grid>

        <Grid item xs={12}>
          vectorsRate {props.setting.vectorsRate}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.vectorsRate} onChange={(e, v) => props.setSetting(pre => { pre.vectorsRate = v; return { ...pre } })} min={0} max={0.1} step={0.001} />
        </Grid>

        <Grid item xs={12}>
          vectorsIterations {props.setting.vectorsIterations}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.vectorsIterations} onChange={(e, v) => props.setSetting(pre => { pre.vectorsIterations = v; return { ...pre } })} min={0} max={1000} step={1} />
        </Grid>

        <Grid item xs={12}>
          ngramWindows {props.setting.ngramWindows}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.ngramWindows} onChange={(e, v) => props.setSetting(pre => { pre.ngramWindows = v; return { ...pre } })} min={1} max={128} step={1} />
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
  const [prompt, setPrompt] = React.useState(Imitation.state.library[1].map(i => i.map(i => Imitation.state.library[0][i]).join('')).join('\n\n'))
  const [setting, setSetting] = React.useState({ vectorsDimensions: 50, vectorsRate: 0.025, vectorsWindows: 4, vectorsIterations: 100, ngramWindows: 8 })
  const [settingDialog, setSettingDialog] = React.useState()

  const train = async () => {
    const tokenizerProcessLoop = async (tokenizerProcess) => {
      const r = await new Promise(r => {
        const loop = () => tokenizerProcess.next ? requestCallback()(() => { tokenizerProcess.next(); loop() }) : r(tokenizerProcess.result)

        loop()
      })

      return r
    }

    const calculatorProcessLoop = async (calculatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => calculatorProcess.next ? requestCallback()(() => { calculatorProcess.next(); loop() }) : r(calculatorProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const promptArray = prompt.split(/\n\n+/).map(i => i.trim()).filter(i => i.length > 0)

    const tokenArray = []

    for (let index = 0; index < promptArray.length; index++) {
      const prompt = promptArray[index]

      const token = await tokenizerProcessLoop(tokenizer(prompt)).then(res => tokenFormat(res, 1))

      tokenArray.push(token)
    }

    console.log(tokenArray)

    const result = await calculatorProcessLoop(calculator(tokenArray, setting))

    console.log(result)

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    Imitation.state.library = result
    Imitation.state.message = 'Updated'
    Imitation.dispatch()
  }

  return <>

    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 68 }} />

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={() => setSettingDialog(true)}><SettingsIcon /></Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={() => train()}><SendIcon /></Button>
    </div>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} prompt={prompt} />

  </>
}

export default App