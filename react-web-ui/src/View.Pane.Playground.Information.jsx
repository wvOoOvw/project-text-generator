import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import Slider from '@mui/material/Slider'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'

import FilterAltIcon from '@mui/icons-material/FilterAlt'

import Imitation from './utils.imitation'

import { generator } from '../text-generator/index'

function SettingDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Settings</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
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
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Save</Button>
    </DialogActions>
  </Dialog>
}

function Token(props) {
  const [origin, setOrigin] = React.useState([])
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(200)

  const onClick = v => {
    if (props.onClick) props.onClick(v)
  }

  const count = React.useMemo(() => Math.ceil(origin.filter(i => i[0].includes(filter)).length / pageSize), [origin, filter, pageSize])

  const renderList = React.useMemo(() => origin.filter(i => i[0].includes(filter)).filter((i, index) => index >= (page - 1) * pageSize && index < page * pageSize), [origin, filter, pageSize, page])

  React.useEffect(() => {
    const max = Math.max(...Imitation.state.library[1])

    var result = Object.keys(Imitation.state.library[0])
    result = result.map((i, index) => [Imitation.state.library[0][index], Imitation.state.library[1][index]])
    result = result
    result = result.sort((a, b) => b[1] - a[1])
    result = result.map(i => { i[2] = i[1] / max; return i })

    setOrigin(result)
  }, [])

  React.useEffect(() => setPage(1), [filter])

  return <Grid container spacing={2}>

    {
      origin ?
        <Grid item xs={12}>
          <div style={{ maxWidth: 720, margin: 'auto', display: 'block', position: 'relative' }}>
            <TextField variant='standard' sx={{ '& input': { fontSize: 16, textAlign: 'center' } }} autoComplete='off' fullWidth value={filter} onChange={e => setFilter(e.target.value)} />
            <FilterAltIcon style={{ position: 'absolute', left: 4, top: 0, bottom: 0, margin: 'auto' }} />
          </div>
        </Grid>
        : null
    }

    {
      renderList.map((i, index) => {
        return <Grid item key={index}>
          <Card>
            <CardActionArea style={{ padding: 12, lineHeight: 1, position: 'relative' }} onClick={() => onClick(i[0])}>
              <span>{i[0]}</span>
              <div style={{ position: 'absolute', right: 4, top: 4, width: 4, height: 4, borderRadius: '50%', background: `rgb(${Math.floor(235 - 235 * i[2])}, ${Math.floor(235 - 235 * i[2])}, ${Math.floor(235 - 235 * i[2])})` }}></div>
            </CardActionArea>
          </Card>
        </Grid>
      })
    }

    {
      count ?
        <Grid item xs={12}>
          <Pagination color='primary' count={count} page={page} onChange={(e, v) => setPage(v)} style={{ margin: 'auto', width: 'fit-content' }} />
        </Grid>
        : null
    }

  </Grid>
}

function Predict() {
  const [promptContent, setPromptContent] = React.useState([])
  const [promptResult, setPromptResult] = React.useState([])
  const [promptModal, setPromptModal] = React.useState()
  const [setting, setSetting] = React.useState({ createTokenLength: 1024, memoryContextLength: 4, memoryContextAuxiliaryLength: 4, memoryDiffLength: 64, toTop: 1, temperature: 1, repeatLength: 8, repeatDistance: 1024, repeatMaxTime: 16, punctuationSpace: 8, stopToken: '' })
  const [settingDialog, setSettingDialog] = React.useState()

  const computeResult = () => {
    const generatorProcess = generator(promptContent, setting, Imitation.state.library)

    generatorProcess.next()

    setPromptResult(generatorProcess.searchResult)
  }

  const promptLengthMax = React.useMemo(() => Object.keys(Imitation.state.library[4]).map(i => Number(i.split('-')[1])).reduce((t, i) => Math.max(t, i), 0), [])

  React.useEffect(() => setPromptContent(new Array(promptLengthMax).fill().map(() => '')), [promptLengthMax])

  React.useEffect(() => computeResult(), [promptContent, setting])

  return <Grid container spacing={2}>

    <Grid item xs={12}>
      <Grid container spacing={1} justifyContent='center'>
        <Grid item><Button variant='contained' style={{ textTransform: 'none' }} onClick={() => setSettingDialog(true)}>Setting</Button></Grid>
        {
          promptContent.map((i, index) => {
            return <Grid item key={index}><Button variant='contained' onClick={() => { promptContent[index] = ''; setPromptContent([...promptContent]); setPromptModal(index) }}>{i ? i : '____'}</Button></Grid>
          })
        }
      </Grid>
    </Grid>

    <Grid item xs={12}>
      <Grid container spacing={1} justifyContent='center'>
        {
          promptResult.map((i, index) => {
            return <Grid item key={index}><Button variant='outlined'>{i.token} {Number(i.percent * 100).toFixed(2)}%</Button></Grid>
          })
        }
      </Grid>
    </Grid>

    <Dialog open={promptModal !== undefined} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 1080 } }} onClose={() => setPromptModal()}>
      <DialogContent>
        <Token onClick={v => { promptContent[promptModal] = v; setPromptContent([...promptContent]); setPromptModal() }} />
      </DialogContent>
    </Dialog>

    <SettingDialog open={Boolean(settingDialog)} onClose={() => setSettingDialog()} setting={setting} setSetting={setSetting} />

  </Grid>
}

function App() {

  const [type, setType] = React.useState('Token')

  return <>

    <div style={{ width: '100%', height: '100%', margin: 'auto', padding: 16, paddingBottom: 68, overflow: 'auto' }}>
      {
        Object.keys(Imitation.state.library[4]).length > 0 && type === 'Token' ? <Token /> : null
      }

      {
        Object.keys(Imitation.state.library[4]).length > 0 && type === 'Predict' ? <Predict /> : null
      }
    </div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 8px' }} onClick={() => setType('Token')}>Token</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 8px' }} onClick={() => setType('Predict')}>Predict</Button>
    </div>

  </>
}

export default App