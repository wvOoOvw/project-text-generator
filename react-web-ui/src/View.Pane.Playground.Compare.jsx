import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import Slider from '@mui/material/Slider'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'

import Imitation from './utils.imitation'

import { tokenFormat, requestRender, requestCallback } from './utils.common'

import { comparator } from '../text-comparator'

function TokenDialog(props) {
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

  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 1080 } }} onClose={() => props.onClose()}>
    <DialogContent>
      <Grid container spacing={2}>

        {
          origin ?
            <Grid item xs={12}>
              <div style={{ maxWidth: 720, margin: 'auto', display: 'block', position: 'relative' }}>
                <TextField variant='standard' sx={{ '& input': { fontSize: 16, textAlign: 'center' } }} autoComplete='off' fullWidth value={filter} onChange={e => setFilter(e.target.value)} />
                {/* <FilterAltIcon style={{ position: 'absolute', left: 4, top: 0, bottom: 0, margin: 'auto' }} /> */}
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
    </DialogContent>
  </Dialog>
}

function App() {
  const [compare, setCompare] = React.useState()
  const [result, setResult] = React.useState([])
  const [tokenDialog, setTokenDialog] = React.useState()

  const compareResult = async () => {
    const comparatorProcessLoop = async (comparatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => comparatorProcess.next ? requestCallback()(() => { comparatorProcess.next(); loop() }) : r(comparatorProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const result = await comparatorProcessLoop(comparator(compare, Imitation.state.library))

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    console.log(result)

    setResult(result)
  }

  React.useEffect(() => compare ? compareResult() : undefined, [compare])

  return <>
    <div style={{ width: '100%', height: '100%', margin: 'auto', padding: 16, paddingBottom: 68, overflow: 'auto' }}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Grid container spacing={1} justifyContent='center'>
            {
              result.sort((a, b) => b.percent - a.percent).map((i, index) => {
                return <Grid item key={index}>
                  <Card>
                    <CardActionArea style={{ padding: 12, lineHeight: 1 }}>
                      {i.token} {Number(i.percent * 100).toFixed(2)}%
                    </CardActionArea>
                  </Card>
                </Grid>
              })
            }
          </Grid>
        </Grid>

      </Grid>
    </div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex', alignItems: 'center' }}>
      <Button variant='contained' onClick={() => { setTokenDialog(true) }}>{compare ? compare : '____'}</Button>
    </div>

    <TokenDialog open={tokenDialog !== undefined} onClose={() => setTokenDialog()} onClick={v => { setCompare(v); setTokenDialog() }} />

  </>
}

export default App