import React from 'react'

import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';

import SendIcon from '@mui/icons-material/Send'
import SettingsIcon from '@mui/icons-material/Settings'

import Imitation from './utils.imitation'

import { safeNumber, specialWord } from './utils.common'

import * as echarts from 'echarts'

const parse = (name) => {

  const format = children => {
    var r = Object.entries(children).map(i => ({ name: specialWord(i[0]), weight: i[1].weight, children: format(i[1].children), collapsed: false }))

    const allWeight = r.reduce((t, i) => t + i.weight, 0)

    r.forEach(i => i.percent = safeNumber(i.weight / allWeight * 100, 4))

    r.sort((a, b) => b.weight - a.weight)

    return r
  }

  return format({ [name]: Imitation.state.library[name] })
}

function SelectDialog(props) {
  const [filter, setFilter] = React.useState('')

  const onClick = v => {
    props.setData(parse(v))
    props.onClose()
  }

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
              <Card onClick={() => onClick(i[0])} style={{ height: '100%' }}>
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

  const [data, setData] = React.useState()
  const [selectDialog, setSelectDialog] = React.useState()

  React.useEffect(() => {
    if (refEcharts.current === undefined) refEcharts.current = echarts.init(ref.current)

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
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 12
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
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
  }, [data])

  React.useEffect(() => {
    const key = Object.keys(Imitation.state.library)[0]
    if (key !== undefined) requestAnimationFrame(() => setData(parse(Object.keys(Imitation.state.library)[0])))
  }, [])

  React.useEffect(() => {
    const observer = new ResizeObserver(en => refEcharts.current.resize())

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return <>

    <Paper style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 1)', position: 'relative' }}>

      <div style={{ width: '100%', height: '100%' }} ref={el => ref.current = el}></div>

      <div style={{ position: 'absolute', bottom: 16, left: 16, width: 'fit-content', display: 'flex' }}>
        <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setSelectDialog(true)}><SettingsIcon /></Button>
      </div>

    </Paper>

    <SelectDialog open={Boolean(selectDialog)} onClose={() => setSelectDialog()} setData={setData} />

  </>
}

export default App