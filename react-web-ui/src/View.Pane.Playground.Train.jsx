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
          Record Context Length Left {props.setting.recordContextLengthLeft}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.recordContextLengthLeft} onChange={(e, v) => props.setSetting(pre => { pre.recordContextLengthLeft = v; return { ...pre } })} min={0} max={10} step={1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Record Context Length Right {props.setting.recordContextLengthRight}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.recordContextLengthRight} onChange={(e, v) => props.setSetting(pre => { pre.recordContextLengthRight = v; return { ...pre } })} min={0} max={10} step={1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Weight {props.setting.weight}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.weight} onChange={(e, v) => props.setSetting(pre => { pre.weight = v; return { ...pre } })} min={1} max={10} step={0.1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Random Addition {props.setting.randomAddition}
        </Grid>
        <Grid item xs={12}>
          <Slider value={props.setting.randomAddition} onChange={(e, v) => props.setSetting(pre => { pre.randomAddition = v; return { ...pre } })} min={-1} max={1} step={0.1} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 14 }}>
          Split Token
        </Grid>
        <Tooltip title='handle each of splited content'>
          <Grid item xs={12}>
            <TextField sx={{ '& input': { fontSize: 14 } }} fullWidth variant='standard' value={props.setting.splitToken} onChange={e => props.setSetting(pre => { pre.splitToken = e.target.value; return { ...pre } })} />
          </Grid>
        </Tooltip>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const [prompt, setPrompt] = React.useState('中国的发展从古至今已经有六十年多了，一直秉持着社会主义的发展是中国的独有特色。相比与其他国家的资本主义发展，中国坚定不移地以社会主义发展为发展宗旨，这一行为看似简单实施起来则是困难。这对于国家领导人的能力更是一种挑战，在毛泽东带领之下的中国不断地快速发展，并且不忘社会主义的初衷，以人人为我、我为人人的群众思想发展。这是我国特色社会主义理论的雏形。习近平也在多次的公开演讲中说到，中国依旧会坚持社会主义发展进行建设，不忘初心是中国发展首要目标。可见特色社会主义理论对于中国的发展起到了很大的作用，民心所向决定了一个国家是否兴盛。然而社会主义发展正是注重群众的想法，与资本主义不同，不会将金钱和其他硬性指标作为国家发展的唯一标准线，社会主义更加致力于取悦群众的需求。这么一种民心所向的国家发展方向致使了中国可以变成现在这么的国际大国，中国特色社会主义理论从毛泽东领导时到现在的习近平领导从没有断过，中国的发展沿袭了毛泽东那个年代时定下的发展目标。中国特色社会主义理论的价值体现在国家的建设以及群众的思想，首先在国家的建设上，因为我国是社会主义国家所以党的思想、领导人的执政，这些都是要以群众的利益为出发点而去行为，与资本主义不同，不能为了国家的发展而舍弃了群众的自由或者是利益。其次从群众的思想上来说，社会主义代表着我为人人、人人为我的思想，国家的建设过程中不断地对群众灌输社会主义的思想也是建设的内容之一。只有当一个国家的群众都是为了社会的发展和共同的利益而行为时，国家才能真正达到社会主义的层次，取得更好的发展。所以，中国特色社会主义理论对于中国的发展起到了很大的作用，也是中国发展必不可缺的理论，其拥有着很高的价值。')
  const [setting, setSetting] = React.useState({ weight: 2, recordContextLengthLeft: 2, recordContextLengthRight: 2, randomAddition: 0, splitToken: '<|split|>' })
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

    var result = Imitation.state.library

    const promptArray = prompt.split(setting.splitToken).map(i => i.replace(/^[\n\s]+/g, '').replace(/[\n\s]+$/g, '')).filter(i => i.length > 0)

    for (let index = 0; index < promptArray.length; index++) {
      const prompt = promptArray[index]

      console.log(prompt)

      const token = await tokenizerProcessLoop(tokenizer(prompt)).then(res => tokenFormat(res, 1))

      console.log(token)

      result = await calculatorProcessLoop(calculator(token, setting, result)).then(res => res.resultLibrary)

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
      <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setSettingDialog(true)}><SettingsIcon /></Button>
      <Button variant='contained' style={{ margin: '0 4px' }} onClick={train}><SendIcon /></Button>
    </div>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />

  </>
}

export default App