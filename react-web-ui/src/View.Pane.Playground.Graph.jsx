import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'

import SettingsIcon from '@mui/icons-material/Settings'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import Imitation from './utils.imitation'

import { safeNumber, specialWord, parseDirection } from './utils.common'

import * as echarts from 'echarts'

const format = (children, direction) => {
  if (!children) return []

  var r = Object.entries(children).map(i => ({ name: specialWord(i[0]), weight: i[1].weight, children: format(i[1][direction], direction), collapsed: false }))

  const allWeight = r.reduce((t, i) => t + i.weight, 0)

  r.forEach(i => i.percent = safeNumber(i.weight / allWeight * 100, 4))

  r.sort((a, b) => b.weight - a.weight)

  return r
}

function SelectDialog(props) {
  const [filter, setFilter] = React.useState('')

  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Select keyword</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField variant='standard' sx={{ '& input': { fontSize: 14 } }} fullWidth value={filter} onChange={e => setFilter(e.target.value)} />
        </Grid>
        {
          Object.entries(Imitation.state.library).filter(i => i[0].includes(filter)).map((i, index) => {
            return <Grid item key={index}>
              <Card onClick={() => { props.setOrigin([i[0]]); props.onClose() }} style={{ height: '100%' }}>
                <CardActionArea style={{ padding: 12, lineHeight: 1, fontSize: 14 }}>{specialWord(i[0])}</CardActionArea>
              </Card>
            </Grid>
          })
        }
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Apply</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const ref = React.useRef()
  const refEcharts = React.useRef()

  const [origin, setOrigin] = React.useState([])
  const [direction, setDirection] = React.useState('LR')
  const [selectDialog, setSelectDialog] = React.useState()

  React.useEffect(() => {
    if (refEcharts.current === undefined) refEcharts.current = echarts.init(ref.current)

    const data = format(origin.reduce((t, i) => ({ ...t, [i]: Imitation.state.library[i] }), {}), parseDirection(direction)[1])

    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        borderWidth: 0,
        formatter: i => `${i.data.name} / ${i.data.weight} / ${i.data.percent}%`,
      },
      series: [
        {
          type: 'tree',
          data: data,
          top: '2%',
          left: '8%',
          bottom: '2%',
          right: '8%',
          symbolSize: 12,
          orient: direction,
          label: {
            position: parseDirection(direction)[0],
            verticalAlign: 'middle',
            align: parseDirection(direction)[1],
            fontSize: 12
          },
          leaves: {
            label: {
              position: parseDirection(direction)[1],
              verticalAlign: 'middle',
              align: parseDirection(direction)[0],
            }
          },
          itemStyle: {
            color: 'black',
          },
          lineStyle: {
            color: 'black',
            width: 1
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    }

    refEcharts.current.setOption(option)
  }, [origin, direction])

  React.useEffect(() => {
    const key = Object.keys(Imitation.state.library)[0]
    if (key !== undefined) requestAnimationFrame(() => setOrigin([key]))
  }, [])

  React.useEffect(() => {
    const observer = new ResizeObserver(en => refEcharts.current.resize())

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return <>

    <div style={{ width: '100%', height: 'calc(100% - 64px)' }} ref={el => ref.current = el}></div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      {
        direction === 'LR' ? <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setDirection('RL')}><PlayArrowIcon /></Button> : null
      }
      {
        direction === 'RL' ? <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setDirection('LR')}><PlayArrowIcon style={{ transform: 'rotate(180deg)' }} /></Button> : null
      }
      <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setSelectDialog(true)}><SettingsIcon /></Button>
    </div>

    <SelectDialog open={Boolean(selectDialog)} onClose={() => setSelectDialog()} setOrigin={setOrigin} />

  </>
}

export default App