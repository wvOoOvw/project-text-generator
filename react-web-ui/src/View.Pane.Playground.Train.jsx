import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'

import SendIcon from '@mui/icons-material/Send'
import SettingsIcon from '@mui/icons-material/Settings'

import Imitation from './utils.imitation'

import { tokenFormat } from './utils.common'

import { tokenizer } from '../text-tokenizer/index'
import { calculator } from '../text-calculator/index'

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Record Context Length {props.setting.recordContextLength}
        </Grid>
        <Tooltip title='set the length of the record, the longer the length, the better the effect in generation, and at the same time, data storage requires a larger volume'>
          <Grid item xs={12}>
            <Slider value={props.setting.recordContextLength} onChange={(e, v) => props.setSetting(pre => { pre.recordContextLength = v; return { ...pre } })} min={1} max={64} step={1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Weight {props.setting.weight}
        </Grid>
        <Tooltip title='impact on the proportion of current training data'>
          <Grid item xs={12}>
            <Slider value={props.setting.weight} onChange={(e, v) => props.setSetting(pre => { pre.weight = v; return { ...pre } })} min={1} max={10} step={0.1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Random Addition {props.setting.randomAddition}
        </Grid>
        <Tooltip title='add random variable influence weights'>
          <Grid item xs={12}>
            <Slider value={props.setting.randomAddition} onChange={(e, v) => props.setSetting(pre => { pre.randomAddition = v; return { ...pre } })} min={-1} max={1} step={0.1} />
          </Grid>
        </Tooltip>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>Append</div>
            <Tooltip title='if append data on current library'>
              <Switch checked={props.setting.append} onChange={(e) => props.setSetting(pre => { pre.append = e.target.checked; return { ...pre } })} />
            </Tooltip>
          </div>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const [prompt, setPrompt] = React.useState(Imitation.state.trainPrompt)
  const [setting, setSetting] = React.useState({ weight: 2, recordContextLength: 4, randomAddition: 0, append: false })
  const [settingDialog, setSettingDialog] = React.useState()

  const train = async () => {
    const tokenizerProcessLoop = async (tokenizerProcess) => {
      const r = await new Promise(r => {
        const loop = () => tokenizerProcess.next ? requestIdleCallback(() => { tokenizerProcess.next(); loop() }) : r(tokenizerProcess.result)

        loop()
      })

      return r
    }

    const calculatorProcessLoop = async (calculatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => calculatorProcess.next ? requestIdleCallback(() => { calculatorProcess.next(); loop() }) : r(calculatorProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    var result = setting.append ? Imitation.state.library : [[], [], [], {}]

    const promptArray = prompt.split(/[\n]+/).map(i => i.trim()).filter(i => i.length > 0)

    for (let index = 0; index < promptArray.length; index++) {
      const prompt = promptArray[index]

      console.log(prompt)

      const token = await tokenizerProcessLoop(tokenizer(prompt)).then(res => tokenFormat(res, 1))

      console.log(token)

      result = await calculatorProcessLoop(calculator(token, setting, result))

      console.log(result)
    }

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    Imitation.state.library = result
    Imitation.state.message = 'Updated'
    Imitation.dispatch()
  }

  return <>

    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', fontSize: 14, lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 64 }} />

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={() => setSettingDialog(true)}>Setting</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 4px' }} onClick={train}>Train</Button>
    </div>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />

  </>
}

export default App