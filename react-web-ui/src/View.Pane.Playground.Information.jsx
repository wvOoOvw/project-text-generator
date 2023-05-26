import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import TextField from '@mui/material/TextField'

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import Fade from './View.Animation.Fade'

import Imitation from './utils.imitation'

function Token() {
  const [wordList, setWordList] = React.useState([])
  const [wordListRender, setWordListRender] = React.useState([])
  const [filter, setFilter] = React.useState('')

  React.useEffect(() => {
    const max = Math.max(...Imitation.state.library[1])

    var result = Object.keys(Imitation.state.library[0])
    result = result.map((i, index) => [Imitation.state.library[0][index], Imitation.state.library[1][index]])
    result = result.filter(i => i[0].includes(filter))
    result = result.sort((a, b) => b[1] - a[1])
    result = result.map(i => { i[2] = i[1] / max; return i })

    setWordListRender(result)
  }, [filter])

  // React.useEffect(() => {
  //   setWordListRender([])

  //   var r

  //   const loop = () => {
  //     r = requestAnimationFrame(() => {
  //       if (wordListRender.length < wordList.length) {
  //         setWordListRender([...wordListRender, ...wordList.slice(wordListRender.length, wordListRender.length + 1)])
  //         loop()
  //       }
  //     })
  //   }

  //   loop()

  //   return () => cancelAnimationFrame(r)
  // }, [wordList])

  return <Grid container spacing={1}>
    <Grid item xs={12} style={{ marginBottom: 16 }}>
      <div style={{ maxWidth: 720, margin: 'auto', display: 'block', position: 'relative' }}>
        <TextField variant='standard' sx={{ '& input': { textAlign: 'center' } }} autoComplete='off' fullWidth value={filter} onChange={e => setFilter(e.target.value)} />
        <FilterAltIcon style={{ position: 'absolute', left: 4, top: 0, bottom: 0, margin: 'auto' }} />
      </div>
    </Grid>
    {
      wordListRender.map((i, index) => {
        return <Grid item key={index}>
          <Fade>
            <Card>
              <CardActionArea style={{ padding: 12, lineHeight: 1, position: 'relative' }}>
                <span>{i[0]}</span>
                <div style={{ position: 'absolute', right: 4, top: 4, width: 4, height: 4, borderRadius: '50%', background: `rgb(${Math.floor(235 - 235 * i[2])}, ${Math.floor(235 - 235 * i[2])}, ${Math.floor(235 - 235 * i[2])})` }}></div>
              </CardActionArea>
            </Card>
          </Fade>
        </Grid>
      })
    }
  </Grid>
}

function Predict() {
  // const [promptLength, setPromptLength] = React.useState(1)
  // const [promptContent, setPromptContent] = React.useState([])
  // const [promptResult, setPromptResult] = React.useState([])

  // const computeResult = () => {

  // }

  // React.useEffect(() => setPromptContent(new Array(promptContent).fill().map(() => [])), [promptLength])
  // React.useEffect(() => computeResult(), [promptContent])


  return <div>
    {/* {
    new Array(promptContent).fill().map((i, index) => {
      return <Button key={index} variant='contained' style={{ margin: 4 }}>{i ? i : '_____'}</Button>
    })
  } */}
  </div>
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