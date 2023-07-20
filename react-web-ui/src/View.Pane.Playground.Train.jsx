import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Slider from '@mui/material/Slider'

import Imitation from './utils.imitation'

import { requestCallback } from './utils.common'

import { tokenizer } from '../text-tokenizer/index'
import { calculator } from '../text-calculator/index'

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>

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
  const [prompt, setPrompt] = React.useState('')
  const [setting, setSetting] = React.useState({ ngramWindows: 8 })
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

      const token = await tokenizerProcessLoop(tokenizer(prompt))

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

  React.useEffect(() => {
    if (Imitation.state.library) setPrompt(Imitation.state.library[1].map(i => i.map(i => (Imitation.state.library[0][i])).join('')).join('\n\n'))
  }, [Imitation.state.library])

  return <>

    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 68 }} />

    <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: 12 }}>{prompt.length}</div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 8px' }} onClick={() => setSettingDialog(true)}>Setting</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 8px' }} onClick={() => train()}>Train</Button>
    </div>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} prompt={prompt} />

  </>
}

export default App