import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Slider from '@mui/material/Slider'
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SendIcon from '@mui/icons-material/Send'
import SettingsIcon from '@mui/icons-material/Settings'

import Imitation from './utils.imitation'

import { generator } from '../text-generator/index'

import { tokenFormat, requestRender, requestCallback } from './utils.common'

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
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function TokenDialog(props) {
  const [origin, setOrigin] = React.useState([])
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(100)

  const onClick = v => { if (props.onClick) props.onClick(v) }

  const count = React.useMemo(() => Math.ceil(origin.filter(i => i.includes(filter)).length / pageSize), [origin, filter, pageSize])

  const renderList = React.useMemo(() => origin.filter(i => i.includes(filter)).filter((i, index) => index >= (page - 1) * pageSize && index < page * pageSize), [origin, filter, pageSize, page])

  React.useEffect(() => setOrigin(props.origin), [props.origin])

  React.useEffect(() => setPage(1), [filter, origin])

  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 1080 } }} onClose={() => props.onClose()}>
    <DialogContent>
      <Grid container spacing={2} justifyContent='center'>

        <Grid item xs={12}>
          <Button fullWidth variant='contained' color='inherit' style={{ maxWidth: 720, height: 36, padding: 0, margin: '0px auto', display: 'block', position: 'relative' }} component='div'>
            <FilterAltIcon style={{ position: 'absolute', left: 8, top: 0, bottom: 0, margin: 'auto' }} />
            <input style={{ width: '100%', height: '100%', textAlign: 'center', fontSize: 16, color: 'black', border: 'none', outline: 'none', background: 'none' }} autoComplete='off' value={filter} onChange={e => setFilter(e.target.value)} />
          </Button>
        </Grid>

        {
          renderList.map((i, index) => {
            return <Grid item key={index}>
              <Card>
                <CardActionArea style={{ padding: 12, lineHeight: 1, position: 'relative' }} onClick={() => onClick(i)}>
                  {i}
                </CardActionArea>
              </Card>
            </Grid>
          })
        }

        <Grid item xs={12}>
          <Pagination color='primary' count={count === 0 ? 1 : count} page={page} onChange={(e, v) => setPage(v)} style={{ margin: 'auto', width: 'fit-content' }} />
        </Grid>

      </Grid>
    </DialogContent>
  </Dialog>
}

function ResultDialog(props) {
  const [origin, setOrigin] = React.useState([])
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(100)

  const onClick = v => { if (props.onClick) props.onClick(v) }

  const count = React.useMemo(() => Math.ceil(origin.filter(i => i.token.includes(filter)).length / pageSize), [origin, filter, pageSize])

  const renderList = React.useMemo(() => origin.filter(i => i.token.includes(filter)).filter((i, index) => index >= (page - 1) * pageSize && index < page * pageSize), [origin, filter, pageSize, page])

  React.useEffect(() => setPage(1), [filter, origin])

  React.useEffect(() => setOrigin(props.origin), [props.origin])

  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 1080 } }} onClose={() => props.onClose()}>
    <DialogContent>
      <Grid container spacing={2} justifyContent='center'>

        <Grid item xs={12}>
          <Button fullWidth variant='contained' color='inherit' style={{ maxWidth: 720, height: 36, padding: 0, margin: '0px auto', display: 'block', position: 'relative' }} component='div'>
            <FilterAltIcon style={{ position: 'absolute', left: 8, top: 0, bottom: 0, margin: 'auto' }} />
            <input style={{ width: '100%', height: '100%', textAlign: 'center', fontSize: 16, color: 'black', border: 'none', outline: 'none', background: 'none' }} autoComplete='off' value={filter} onChange={e => setFilter(e.target.value)} />
          </Button>
        </Grid>

        {
          renderList.map((i, index) => {
            return <Grid item key={index}>
              <Card>
                <CardActionArea style={{ padding: 12, lineHeight: 1, position: 'relative' }} onClick={() => onClick(i.token)}>
                  {i.token} {Number(i.percent * 100).toFixed(2)}%
                </CardActionArea>
              </Card>
            </Grid>
          })
        }

        <Grid item xs={12}>
          <Pagination color='primary' count={count === 0 ? 1 : count} page={page} onChange={(e, v) => setPage(v)} style={{ margin: 'auto', width: 'fit-content' }} />
        </Grid>

      </Grid>
    </DialogContent>
  </Dialog>
}

function App() {
  const keyRef = React.useRef(Math.random())

  const [token, setToken] = React.useState([])
  const [setting, setSetting] = React.useState({ createTokenLength: 1, memoryContextLength: 4, topP: 0.9, temperature: 1.5, repeatLength: 8, repeatDistance: 1024, repeatMaxTime: 16, punctuationSpace: 8, stopToken: '' })
  const [settingDialog, setSettingDialog] = React.useState()
  const [tokenDialog, setTokenDialog] = React.useState()
  const [tokenDialogIndex, setTokenDialogIndex] = React.useState()
  const [tokenDialogOrigin, setTokenDialogOrigin] = React.useState(Object.values(Imitation.state.library[0]))
  const [resultDialog, setResultDialog] = React.useState()
  const [resultDialogOrigin, setResultDialogOrigin] = React.useState([])

  const generate = async () => {
    const generatorProcessLoop = async (generatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => generatorProcess.next ? requestCallback()(() => { generatorProcess.next(); loop() }) : r(generatorProcess.searchResult)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    console.log(token)

    const result = await generatorProcessLoop(generator(token, setting, Imitation.state.library))

    console.log(result)

    await new Promise(r => setTimeout(r, 500))

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    setResultDialog(true)

    setResultDialogOrigin(result)
  }

  React.useEffect(() => setToken(new Array(setting.memoryContextLength).fill('')), [setting.memoryContextLength])

  return <>

    <div style={{ width: '100%', height: '100%', margin: 'auto', paddingBottom: 68, paddingTop: 0, overflow: 'auto' }}>
      <div style={{ height: '100%', margin: '0 16px', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        {
          token.map((i, index) => {
            return <Button style={{ margin: 8 }} variant='contained' onClick={() => { keyRef.current = Math.random(); setToken(pre => { pre[index] = ''; return [...pre] }); setTokenDialog(true); setTokenDialogIndex(index) }} key={index}>{i ? i : '____'}</Button>
          })
        }
        <Button disabled style={{ margin: 8 }} variant='contained'>...</Button>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button style={{ margin: '0 8px' }} variant='contained' onClick={() => { keyRef.current = Math.random(); setSettingDialog(true) }}><SettingsIcon /></Button>
      <Button style={{ margin: '0 8px' }} variant='contained' onClick={() => { keyRef.current = Math.random(); generate() }}><SendIcon /></Button>
    </div>

    <TokenDialog key={keyRef.current + 1} open={Boolean(tokenDialog)} onClose={() => setTokenDialog()} onClick={v => { setToken(pre => { pre[tokenDialogIndex] = v; return [...pre] }); setTokenDialog() }} origin={tokenDialogOrigin} index={tokenDialogIndex} />

    <ResultDialog key={keyRef.current + 2} open={Boolean(resultDialog)} onClose={() => setResultDialog()} onClick={v => { setResultDialog() }} origin={resultDialogOrigin} />

    <SettingDialog key={keyRef.current + 3} open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />

  </>
}

export default App