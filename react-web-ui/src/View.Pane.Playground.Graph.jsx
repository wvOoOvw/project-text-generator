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

import * as echarts from 'echarts'

function SelectDialog(props) {
  const [filter, setFilter] = React.useState('')

  const format = children => {
    const r = []

    Object.entries(children).forEach(([key, value]) => {
      r.push({ name: key, weight: value.weight, children: format(value.children) })
    })

    return r
  }

  const compute = children => {
    const all = children.reduce((t, i) => t + i.weight, 0)

    children.forEach(i => {
      i.percent = Number(i.weight / all).toFixed(4)

      i.children = compute(i.children)
    })

    return children
  }

  const onClick = v => {
    const data = compute(format({ [v]: Imitation.state.context[v] }))

    props.setData(data)
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
          Object.entries(Imitation.state.context).filter(i => i[0].includes(filter)).map((i, index) => {
            return <Grid item key={index}>
              <Card onClick={() => onClick(i[0])}>
                <CardActionArea style={{ padding: 12 }}>{i[0]}</CardActionArea>
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

  const [data, setData] = React.useState([])
  const [selectDialog, setSelectDialog] = React.useState()

  React.useEffect(() => {
    if (refEcharts.current === undefined) refEcharts.current = echarts.init(ref.current)

    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        borderWidth: 0,
        formatter: i => `${i.data.name} / ${i.data.weight} / ${i.data.percent * 100}%`,
      },
      series: [
        {
          type: 'tree',
          data: data,
          top: '2%',
          left: '8%',
          bottom: '2%',
          right: '16%',
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
    const observer = new ResizeObserver(en => refEcharts.current.resize())

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return <>

    <Paper style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 1)', position: 'relative' }}>

      <div style={{ width: '100%', height: '100%' }} ref={el => ref.current = el}></div>

      <div style={{ position: 'absolute', bottom: 16, left: 16, width: 'fit-content', display: 'flex' }}>
        <Button variant='contained' style={{ margin: '0 4px' }}><SendIcon /></Button>
        <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setSelectDialog(true)}><SettingsIcon /></Button>
      </div>

    </Paper>

    <SelectDialog open={Boolean(selectDialog)} onClose={() => setSelectDialog()} setData={setData} />

  </>
}

export default App