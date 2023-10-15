import React from 'react'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import SendIcon from '@mui/icons-material/Send'
import SettingsIcon from '@mui/icons-material/Settings'
import ArticleIcon from '@mui/icons-material/Article'
import NumbersIcon from '@mui/icons-material/Numbers'

import Animation from './View.Component.Animation'

import Imitation from './utils.imitation'

function SettingDialog(props) {
  const [value, setValue] = React.useState(props.value)

  return <Dialog open={true} sx={{ '& .MuiDialog-paper': { width: 720, maxWidth: '100%' } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>

        <Grid item xs={12}>
          Ngram Windows {props.ngramWindows}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.ngramWindows} onChange={(e, v) => setValue(pre => { pre.ngramWindows = v; return { ...pre } })} min={1} max={128} step={1} />
        </Grid>

      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => { props.onChange(value); props.onClose(); }}>Save</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const [value, setValue] = React.useState('')
  const [setting, setSetting] = React.useState({ ngramWindows: 8 })
  const [settingDialog, setSettingDialog] = React.useState()

  const train = async () => {
    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const [tokenizer, calculator] = await Promise.all([import('../text-tokenizer/index').then(res => res.tokenizer), import('../text-calculator/index').then(res => res.calculator)])

    const tokenizerProcessLoop = async (tokenizerProcess) => {
      const r = await new Promise(r => {
        const loop = () => {
          requestIdleCallback(idle => {
            while (idle.timeRemaining() > 2 && tokenizerProcess.next !== null) tokenizerProcess.next()
            if (tokenizerProcess.next !== null) loop(r)
            if (tokenizerProcess.next === null) r(tokenizerProcess.result)
          })
        }

        loop()
      })

      return r
    }

    const calculatorProcessLoop = async (calculatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => {
          requestIdleCallback(idle => {
            while (idle.timeRemaining() > 2 && calculatorProcess.next !== null) calculatorProcess.next()
            if (calculatorProcess.next !== null) loop(r)
            if (calculatorProcess.next === null) r(calculatorProcess.result)
          })
        }

        loop()
      })

      return r
    }

    const valueArray = value.split(/\n\n+/).map(i => i.trim()).filter(i => i.length > 0)

    const tokenArray = []

    for (let index = 0; index < valueArray.length; index++) {
      const value = valueArray[index]

      const token = await tokenizerProcessLoop(tokenizer(value))

      tokenArray.push(token)
    }

    const result = await calculatorProcessLoop(calculator(tokenArray, setting))

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    Imitation.state.library = result
    Imitation.state.message = 'Updated'
    Imitation.dispatch()
  }

  React.useEffect(() => {
    if (Imitation.state.library) setValue(Imitation.state.library[1].map(i => i.map(i => (Imitation.state.library[0][i])).join('')).join('\n\n'))
  }, [Imitation.state.library])

  return <div style={{ width: '100%', padding: 16, overflowX: 'hidden' }}>

    <div style={{ width: 840, maxWidth: '100%', margin: 'auto' }}>
      <Animation tag={Card} restore={true} animation={[{ transform: 'translate(100px, 0)', opacity: 0 }, { transform: 'translate(0, 0)', opacity: 1 }]} style={{ transition: '0.5s all' }}>
        <CardContent style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14 }}>Text Train</div>
          <ArticleIcon />
        </CardContent>
        <Divider />
        <CardContent style={{ padding: 16 }}>
          <TextField minRows={4} sx={{ '& .MuiOutlinedInput-root': { padding: 0 }, '& textarea': { fontSize: 14, lineHeight: 1.5 }, '& fieldset': { border: 'none' } }} placeholder='...' multiline fullWidth variant='outlined' value={value} onChange={e => setValue(e.target.value)} />
        </CardContent>
        <Divider />
        <CardActions style={{ padding: 16, justifyContent: 'space-between', overflowX: 'auto' }}>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button variant='outlined' style={{ whiteSpace: 'nowrap', marginRight: 8 }}><NumbersIcon style={{ marginRight: 4 }} />{value.length}</Button>
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button variant='outlined' style={{ marginLeft: 8 }} onClick={() => setSettingDialog(true)}><SettingsIcon style={{ marginRight: 4 }} />Setting</Button>
            <Button variant='outlined' style={{ marginLeft: 8 }} onClick={() => train()}><SendIcon style={{ marginRight: 4 }} />Train</Button>
          </div>
        </CardActions>
      </Animation>
    </div>

    {
      settingDialog ? <SettingDialog value={setting} onChange={setSetting} onClose={() => setSettingDialog()} /> : null
    }

  </div>
}

export default App