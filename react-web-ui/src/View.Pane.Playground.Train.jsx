import React from 'react'

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Slider from '@mui/material/Slider';

import SendIcon from '@mui/icons-material/Send'
import SettingsIcon from '@mui/icons-material/Settings'

import Imitation from './utils.imitation'

import { specialWord } from './utils.common'

import { tokenizer } from '../text-tokenizer/index'
import { calculator } from '../text-calculator/index'

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Record length {props.setting.recordLength}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.recordLength} onChange={(e, v) => props.setSetting(pre => { pre.recordLength = v; return { ...pre } })} min={1} max={10} step={1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Weight {props.setting.weight}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.weight} onChange={(e, v) => props.setSetting(pre => { pre.weight = v; return { ...pre } })} min={1} max={10} step={0.1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Random addition {props.setting.randomAddition}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.randomAddition} onChange={(e, v) => props.setSetting(pre => { pre.randomAddition = v; return { ...pre } })} min={-1} max={1} step={0.1} />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function ResultDialog(props) {
  const resultFlat = (children, deep = 0) => {
    const r = []

    Object.entries(children).forEach(([key, value]) => {
      r.push([key, value, deep])
      r.push(...resultFlat(value.children, deep + 1))
    })

    return r

  }
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Result</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        {
          props.resultDiff ?
            Object.entries(props.resultDiff).map(([key, value], index) => {
              const children = resultFlat(value.children)
              return <Grid item xs={12} key={index}>
                <Accordion>
                  <AccordionSummary style={{ height: 48, minHeight: 0, fontSize: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div>{specialWord(key)}</div>
                      <div>{value.weight}</div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {
                        children.map(([key, value, deep], index) => {
                          return <React.Fragment key={index}>
                            <Grid item xs={12}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: deep * 16 }}>
                                <div>{specialWord(key)}</div>
                                <div>{value.weight}</div>
                              </div>
                            </Grid>
                            {
                              index !== children.length - 1 ? <Grid item xs={12}><Divider /></Grid> : null
                            }
                          </React.Fragment>
                        })
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
  const [setting, setSetting] = React.useState({ weight: 2, recordLength: 2, randomAddition: 0 })
  const [resultLibrary, setResultLibrary] = React.useState()
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

    const calculatorProcessLoop = async (calculatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => calculatorProcess.next ? requestIdleCallback(() => { calculatorProcess.next(); loop() }) : r(calculatorProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    console.log(prompt)

    const token = await tokenizerProcessLoop(tokenizer(prompt))

    console.log(token)

    const result = await calculatorProcessLoop(calculator(token, setting, Imitation.state.library))

    console.log(result)

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    setResultLibrary(result.resultLibrary)
    setResultDiff(result.resultDiff)
    setResultDialog(true)
  }

  const apply = () => {
    Imitation.state.library = resultLibrary
    setResultDialog()
  }

  return <>

    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', height: '100%', fontSize: 14, lineHeight: 1.5, border: 'none', outline: 'none', resize: 'none', padding: 16, paddingBottom: 64 }} />

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ margin: '0 4px' }} onClick={train}><SendIcon /></Button>
      <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setSettingDialog(true)}><SettingsIcon /></Button>
    </div>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />

    <ResultDialog open={Boolean(resultDialog)} onClose={() => setResultDialog()} resultDiff={resultDiff} apply={apply} />

  </>
}

export default App