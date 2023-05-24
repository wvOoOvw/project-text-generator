import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'

import Imitation from './utils.imitation'

function Token() {
  const [filter, setFilter] = React.useState('')

  const wordMap = React.useMemo(() => {
    return Object.keys(Imitation.state.library[0]).map((i, index) => [Imitation.state.library[0][index], Imitation.state.library[1][index]]).filter(i => i[0].includes(filter)).sort((a, b) => b[1] - a[1])
  }, [filter])

  return <Grid container spacing={1}>
    <Grid item xs={12}>
      <TextField variant='standard' sx={{ '& input': { fontSize: 14 } }} fullWidth value={filter} onChange={e => setFilter(e.target.value)} />
    </Grid>
    {
      wordMap.map((i, index) => {
        return <Grid item key={index}>
          <Card style={{ height: '100%' }}>
            <Badge badgeContent={i[1]}>
              <CardActionArea style={{ padding: 12, lineHeight: 1, fontSize: 14 }}>{i[0]}</CardActionArea>
            </Badge>
          </Card>
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