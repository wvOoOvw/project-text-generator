import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SendIcon from '@mui/icons-material/Send'

import Imitation from './utils.imitation'

import { requestRender, requestCallback } from './utils.common'

import { comparator } from '../text-comparator'

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
      <Grid container spacing={2}>

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
      <Grid container spacing={2}>

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
  const [compare, setCompare] = React.useState()
  const [tokenDialog, setTokenDialog] = React.useState()
  const [tokenDialogOrigin, setTokenDialogOrigin] = React.useState(Object.values(Imitation.state.library[0]))
  const [resultDialog, setResultDialog] = React.useState()
  const [resultDialogOrigin, setResultDialogOrigin] = React.useState([])

  const compareResult = async () => {
    const comparatorProcessLoop = async (comparatorProcess) => {
      const r = await new Promise(r => {
        const loop = () => comparatorProcess.next ? requestCallback()(() => { comparatorProcess.next(); loop() }) : r(comparatorProcess.result)

        loop()
      })

      return r
    }

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const result = await comparatorProcessLoop(comparator(Imitation.state.library[0].indexOf(compare), Imitation.state.library)).then(res => res.sort((a, b) => b.percent - a.percent))

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })

    setResultDialog(true)
    
    setResultDialogOrigin(result)
  }

  return <>

    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button style={{ margin: 8 }} variant='contained' onClick={() => { setTokenDialog(true) }}>{compare ? compare : '____'}</Button>
      <Button style={{ margin: 8 }} variant='contained' onClick={() => { compareResult() }}><SendIcon /></Button>
    </div>

    <TokenDialog open={Boolean(tokenDialog)} onClose={() => setTokenDialog()} onClick={v => { setCompare(v); setTokenDialog() }} origin={tokenDialogOrigin}/>

    <ResultDialog open={Boolean(resultDialog)} onClose={() => setResultDialog()} onClick={v => { setCompare(v); setResultDialog() }} origin={resultDialogOrigin} />

  </>
}

export default App