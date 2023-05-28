import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import Slider from '@mui/material/Slider'

import FilterAltIcon from '@mui/icons-material/FilterAlt'

import Imitation from './utils.imitation'

import { generator } from '../text-generator/index'

function Token() {
  const [origin, setOrigin] = React.useState([])
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(200)

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
            <CardActionArea style={{ padding: 12, lineHeight: 1, position: 'relative' }}>
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
  const [promptLength, setPromptLength] = React.useState(1)
  const [promptContent, setPromptContent] = React.useState([])
  const [promptResult, setPromptResult] = React.useState([])
  const [setting, setSetting] = React.useState({ createTokenLength: 256, memoryContextLength: 4, toTop: 0.75, temperature: 1, repeatLength: 8, repeatDistance: 256, repeatMaxTime: 16, punctuationSpace: 8, stopToken: '' })

  const computeResult = async () => {
    const tokenizerProcessLoop = async (tokenizerProcess) => {
      const r = await new Promise(r => {
        const loop = () => tokenizerProcess.next ? requestIdleCallback(() => { tokenizerProcess.next(); loop() }) : r(tokenizerProcess.result)

        loop()
      })

      return r
    }

    const generatorProcessLoop = async (generatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => generatorProcess.next ? requestIdleCallback(() => { generatorProcess.next(); setPrompt([...generatorProcess.token, ...tokenFormat(generatorProcess.result, 2)].join('')); loop() }) : r(generatorProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    console.log(prompt)

    const token = await tokenizerProcessLoop(tokenizer(prompt))

    console.log(token)

    const result = await generatorProcessLoop(generator(token, setting, Imitation.state.library))

    console.log(result)

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
  }

  const promptLengthMax = React.useMemo(() => Object.keys(Imitation.state.library[2]).map(i => Number(i.split('-')[1])).reduce((t, i) => Math.max(t, i), 0), [])

  React.useEffect(() => setPromptContent(new Array(promptLength).fill().map(() => [])), [promptLength])

  // React.useEffect(() => computeResult(), [promptContent])

  return <Grid container spacing={2}>

    <Grid item xs={12}>
      <Slider style={{ maxWidth: 720, width: '100%', margin: 'auto', display: 'block' }} value={promptLength} onChange={(e, v) => setPromptLength(v)} min={1} max={promptLengthMax} step={1} />
    </Grid>

    <Grid item xs={12}>
      <Grid container spacing={1} justifyContent='center'>
        {
          promptContent.map((i, index) => {
            return <Grid item key={index}><Button variant='contained'>____</Button></Grid>
          })
        }
      </Grid>
    </Grid>


  </Grid>
}

function App() {

  const [type, setType] = React.useState('Token')

  return <>

    <div style={{ width: '100%', height: '100%', margin: 'auto', padding: 16, paddingBottom: 68, overflow: 'auto' }}>
      {
        type === 'Token' ? <Token /> : null
      }

      {
        type === 'Predict' ? <Predict /> : null
      }
    </div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant={type === 'Token' ? 'contained' : 'outlined'} style={{ textTransform: 'none', margin: '0 8px' }} onClick={() => setType('Token')}>Token</Button>
      <Button variant={type === 'Predict' ? 'contained' : 'outlined'} style={{ textTransform: 'none', margin: '0 8px' }} onClick={() => setType('Predict')}>Predict</Button>
    </div>

  </>
}

export default App