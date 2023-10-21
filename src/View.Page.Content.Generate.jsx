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
import ClearAllIcon from '@mui/icons-material/ClearAll'
import ArticleIcon from '@mui/icons-material/Article'
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import CopyAllIcon from '@mui/icons-material/CopyAll'
import NumbersIcon from '@mui/icons-material/Numbers'

import Animation from './View.Component.Animation'

import Imitation from './utils.imitation'

function SettingDialog(props) {
  const [value, setValue] = React.useState(props.value)

  return <Dialog open={true} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Setting</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>

        <Grid item xs={12}>
          Sequences Count {value.sequencesCount}
        </Grid>
        <Grid item xs={12}>
          <Slider value={value.sequencesCount} onChange={(e, v) => { setValue({ ...value, sequencesCount: v }) }} min={1} max={5} step={1} />
        </Grid>

        <Grid item xs={12}>
          Create Token Length {value.createTokenLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={value.createTokenLength} onChange={(e, v) => setValue(pre => { pre.createTokenLength = v; return { ...pre } })} min={1} max={2048} step={1} />
        </Grid>

        <Grid item xs={12}>
          Memory Context Length {value.memoryContextLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={value.memoryContextLength} onChange={(e, v) => setValue(pre => { pre.memoryContextLength = v; return { ...pre } })} min={1} max={64} step={1} />
        </Grid>

        <Grid item xs={12}>
          Top P {value.topP}
        </Grid>
        <Grid item xs={12}>
          <Slider value={value.topP} onChange={(e, v) => setValue(pre => { pre.topP = v; return { ...pre } })} min={0} max={1} step={0.01} />
        </Grid>

        <Grid item xs={12}>
          Temperature {value.temperature}
        </Grid>
        <Grid item xs={12}>
          <Slider value={value.temperature} onChange={(e, v) => setValue(pre => { pre.temperature = v; return { ...pre } })} min={0} max={2} step={0.01} />
        </Grid>

        <Grid item xs={12}>
          Repeat Length {value.repeatLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={value.repeatLength} onChange={(e, v) => setValue(pre => { pre.repeatLength = v; return { ...pre } })} min={0} max={64} step={1} />
        </Grid>

        <Grid item xs={12}>
          Punctuation Space {value.punctuationSpace}
        </Grid>
        <Grid item xs={12}>
          <Slider value={value.punctuationSpace} onChange={(e, v) => setValue(pre => { pre.punctuationSpace = v; return { ...pre } })} min={0} max={64} step={1} />
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
  const [setting, setSetting] = React.useState({ sequencesCount: 3, createTokenLength: 1024, memoryContextLength: 4, topP: 0.9, temperature: 1.5, repeatLength: 8, repeatDistance: 1024, repeatMaxTime: 4, punctuationSpace: 8, stopToken: '' })
  const [result, setResult] = React.useState([])
  const [settingDialog, setSettingDialog] = React.useState()

  const generate = async (paramsSetting) => {
    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const [tokenizer, generator] = await Promise.all([import('../text-tokenizer/index').then(res => res.tokenizer), import('../text-generator/index').then(res => res.generator)])

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

    const generatorProcessLoop = async (generatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => {
          requestIdleCallback(idle => {
            while (idle.timeRemaining() > 2 && generatorProcess.next !== null) generatorProcess.next()
            if (generatorProcess.next !== null) loop(r)
            if (generatorProcess.next === null) r(generatorProcess.result)
          })
        }

        loop()
      })

      return r
    }

    const token = await tokenizerProcessLoop(tokenizer(value))

    const result = []

    for (let index = 0; index < setting.sequencesCount; index++) {
      const result_ = await generatorProcessLoop(generator(token, setting, Imitation.state.library))
      result.push(result_.join(''))
    }

    if (result) setResult(result)

    if (result.every(i => i === '')) Imitation.setState(pre => { pre.message = 'Can not match word'; return pre })

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
  }

  return <div style={{ width: '100%', padding: 16, overflowX: 'hidden' }} >

    <div style={{ width: 840, maxWidth: '100%', margin: 'auto' }}>
      <Animation tag={Card} restore={true} animation={[{ transform: 'translate(100px, 0)', opacity: 0 }, { transform: 'translate(0, 0)', opacity: 1 }]} style={{ transition: '0.5s all' }}>
        <CardContent style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14 }}>Text Generate</div>
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
            <Button variant='outlined' style={{ whiteSpace: 'nowrap', marginLeft: 8 }} onClick={() => setSettingDialog(true)}><SettingsIcon style={{ marginRight: 4 }} />Settting</Button>
            <Button variant='outlined' style={{ whiteSpace: 'nowrap', marginLeft: 8 }} onClick={() => setResult([])}><ClearAllIcon style={{ marginRight: 4 }} />Clear</Button>
            <Button variant='outlined' style={{ whiteSpace: 'nowrap', marginLeft: 8 }} onClick={() => generate()}><SendIcon style={{ marginRight: 4 }} />Generate</Button>
          </div>
        </CardActions>
      </Animation>

      {
        result.length ?
          result.filter(i => i).map((i, index) => {
            return <Animation tag={Card} restore={true} animation={[{ transform: 'translate(100px, 0)', opacity: 0 }, { transform: 'translate(0, 0)', opacity: 1 }]} style={{ marginTop: 16, transition: '0.5s all' }} key={index}>
              <CardContent style={{ padding: 16, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-line', color: 'rgb(115, 120, 125)' }}>
                {i}
              </CardContent>
              <CardActions style={{ padding: 16, paddingTop: 0, justifyContent: 'space-between' }}>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <Button variant='outlined' style={{ whiteSpace: 'nowrap', marginRight: 8 }}><NumbersIcon style={{ marginRight: 4 }} />{i.length}</Button>
                </div>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <Button variant='outlined' style={{ whiteSpace: 'nowrap', marginLeft: 8 }} onClick={() => { setValue(value + i); setResult([]); }}><FileDownloadDoneIcon style={{ marginRight: 4 }} />Apply</Button>
                </div>
              </CardActions>
            </Animation>
          })
          : null
      }
    </div>

    {
      settingDialog ? <SettingDialog value={setting} onChange={setSetting} onClose={() => setSettingDialog()} /> : null
    }

  </div>
}

export default App