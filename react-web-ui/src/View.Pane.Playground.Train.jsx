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

import * as echarts from 'echarts'
import * as Diff from 'diff'

import Imitation from './utils.imitation'

import { tokenizer } from '../text-tokenizer/index'

const resulter = (token, setting) => {
  const resultContext = JSON.parse(JSON.stringify(Imitation.state.context))
  const resultDiff = {}

  const process = { token: token, setting: setting, index: 0, result: { resultContext, resultDiff }, next: () => next(process) }

  const next = (process) => {
    const current = process.token[process.index]

    const next = process.token[process.index + 1]

    if (next) {
      if (!process.result.resultContext[current]) {
        process.result.resultContext[current] = { w: current, next: {} }
      }
      if (!process.result.resultContext[current].next[next]) {
        process.result.resultContext[current].next[next] = { w: next, wt: 0 }
      }
      if (process.result.resultContext[current].next[next]) {
        process.result.resultContext[current].next[next].wt = process.result.resultContext[current].next[next].wt + process.setting.weight
      }

      if (!process.result.resultDiff[current]) {
        process.result.resultDiff[current] = { w: current, next: {} }
      }
      if (!process.result.resultDiff[current].next[next]) {
        process.result.resultDiff[current].next[next] = { w: next, wt: 0 }
      }
      if (process.result.resultDiff[current].next[next]) {
        process.result.resultDiff[current].next[next].wt = process.result.resultDiff[current].next[next].wt + process.setting.weight
      }
    }

    process.index = process.index + 1

    if (!process.token[process.index]) process.next = undefined

    return process
  }

  return process
}

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Count {props.setting.count}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.count} onChange={(e, v) => props.setSetting(pre => { pre.count = v; return { ...pre } })} min={1} max={10} step={1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Random addition {props.setting.randomAddition}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.randomAddition} onChange={(e, v) => props.setSetting(pre => { pre.randomAddition = v; return { ...pre } })} min={-10} max={10} step={0.1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Weight {props.setting.weight}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.weight} onChange={(e, v) => props.setSetting(pre => { pre.weight = v; return { ...pre } })} min={0} max={10} step={0.1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Marginal decline {props.setting.marginalDecline}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.marginalDecline} onChange={(e, v) => props.setSetting(pre => { pre.marginalDecline = v; return { ...pre } })} min={0} max={10} step={0.1} />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function ResultDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Result</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        {
          props.resultDiff ?
            Object.entries(props.resultDiff).map(([key, value], index) => {
              return <Grid item xs={12} key={index}>
                <Accordion>
                  <AccordionSummary>{key}</AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {
                        value.next ?
                          Object.entries(value.next).map(([key, value], index) => {
                            return <Grid item xs={12} key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>{key}</div>
                              <div>{value.wt}</div>
                            </Grid>
                          })
                          : null
                      }
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            })
            : null
        }
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.apply()}>Apply</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const [prompt, setPrompt] = React.useState('爱是什么？这是所有人心底一个永恒的问题。爱，是永恒的寻觅。爱一旦被找到，它也将变为永恒。但是我们真的找到过爱吗？当我们定义爱的同时，是否也在否定爱呢？在给我们所认为的爱加种种限制的同时，我们试图按自己的方式理解它，或想将其据为己有时，我们是否也在破坏它呢？我们将爱施与周围的所有人，而如何给予是由期望的回报来决定的。')
  const [setting, setSetting] = React.useState({ count: 1, weight: 4, marginalDecline: 2, randomAddition: 0 })
  const [resultContext, setResultContext] = React.useState()
  const [resultDiff, setResultDiff] = React.useState()
  const [settingDialog, setSettingDialog] = React.useState()
  const [resultDialog, setResultDialog] = React.useState()

  const train = async () => {

    const tokenizerProcessLoop = async (tokenizerProcess) => {
      const r = await new Promise(r => {
        const loop = () => tokenizerProcess.next ? requestIdleCallback(() => { tokenizerProcess.next(); loop() }) : r(tokenizerProcess.result)

        loop()
      })

      return r
    }

    const resultProcessLoop = async (resultProcess) => {
      const r = await new Promise(r => {
        const loop = () => resultProcess.next ? requestIdleCallback(() => { resultProcess.next(); loop() }) : r(resultProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    await new Promise(r => setTimeout(r, 500))

    const token = await tokenizerProcessLoop(tokenizer(prompt))

    const result = await resultProcessLoop(resulter(token, setting))

    await new Promise(r => setTimeout(r, 500))

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    setResultContext(result.resultContext)
    setResultDiff(result.resultDiff)
    setResultDialog(true)
  }

  const apply = () => {
    Imitation.state.context = resultContext
    setResultDialog()
  }

  return <>

    <Paper style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 1)', position: 'relative' }}>

      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', fontSize: 14, lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 64 }} />

      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
        <Button variant='contained' style={{ margin: '0 4px' }} onClick={train}><SendIcon /></Button>
        <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setSettingDialog(true)}><SettingsIcon /></Button>
      </div>

    </Paper>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />
    <ResultDialog open={Boolean(resultDialog)} onClose={() => setResultDialog()} resultDiff={resultDiff} apply={apply} />

  </>
}

export default App