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
import EditIcon from '@mui/icons-material/Edit'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

import Imitation from './utils.imitation'

import { safeNumber, specialWord, parseDirection } from './utils.common'

import * as echarts from 'echarts'

const format = (children, parent, direction) => {
  if (!children) return []

  var r = Object.entries(children).map(i => ({ name: specialWord(i[0]), weight: i[1].weight, children: format(i[1][direction], [...parent, { name: i[0], direction: direction }], direction), parent: [...parent], collapsed: false }))

  const allWeight = r.reduce((t, i) => t + i.weight, 0)

  r.forEach(i => { i.allWeight = allWeight; i.percent = safeNumber(i.weight / allWeight * 100, 4) })

  r.sort((a, b) => b.weight - a.weight)

  return r
}

function FilterDialog(props) {
  const [filter, setFilter] = React.useState('')

  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Filter</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField variant='standard' sx={{ '& input': { fontSize: 14 } }} fullWidth autoFocus value={filter} onChange={e => setFilter(e.target.value)} />
        </Grid>
        {
          Imitation.state.library ?
            Object.entries(Imitation.state.library).filter(i => i[0].includes(filter)).map((i, index) => {
              return <Grid item key={index}>
                <Card onClick={() => { props.onUpdate(i[0]); props.onClose() }} style={{ height: '100%' }}>
                  <CardActionArea style={{ padding: 12, lineHeight: 1, fontSize: 14 }}>{specialWord(i[0])}</CardActionArea>
                </Card>
              </Grid>
            })
            : null
        }
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={() => props.onClose()}>Apply</Button>
    </DialogActions>
  </Dialog>
}

function EditDialog(props) {
  const [value, setValue] = React.useState()

  const findParent = (parent) => parent.reduce((t, i) => t[i.name][i.direction], Imitation.state.library)

  const update = () => {
    const parent = findParent(props.value.parent)

    if (Number(value.weight) !== props.value.weight) parent[props.value.name].weight = Number(value.weight)

    if (value.name !== props.value.name) {
      parent[value.name] = parent[props.value.name]
      delete parent[props.value.name]
    }

    Imitation.state.message = 'Updated'
    Imitation.dispatch()

    props.onUpdate()
    props.onClose()
  }

  const remove = () => {
    const parent = findParent(props.value.parent)

    delete parent[props.value.name]

    Imitation.state.message = 'Removed'
    Imitation.dispatch()

    props.onUpdate()
    props.onClose()
  }

  React.useEffect(() => {
    if (!props.value) return

    setValue({ name: props.value.name, weight: props.value.weight, allWeight: props.value.allWeight, percent: props.value.percent })
  }, [props.value])

  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle style={{ fontSize: 16 }}>Edit</DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={1}>
        {
          value ?
            <Grid container spacing={1}>
              <Grid item xs={12} style={{ fontSize: 14 }}>
                Name
              </Grid>
              <Grid item xs={12}>
                <TextField sx={{ '& input': { fontSize: 14 } }} fullWidth value={value.name} onChange={e => setValue(pre => { pre.name = e.target.value; return { ...pre } })} />
              </Grid>
              <Grid item xs={12} style={{ fontSize: 14 }}>
                Weight
              </Grid>
              <Grid item xs={12}>
                <TextField sx={{ '& input': { fontSize: 14 } }} fullWidth value={value.weight} onChange={e => setValue(pre => { pre.weight = e.target.value; return { ...pre } })} />
              </Grid>
            </Grid>
            : null
        }
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={remove}>Remove</Button>
      <Button variant='contained' onClick={update}>Update</Button>
    </DialogActions>
  </Dialog>
}

function App() {
  const ref = React.useRef()
  const refEcharts = React.useRef()

  const [origin, setOrigin] = React.useState()
  const [direction, setDirection] = React.useState('LR')
  const [edit, setEdit] = React.useState(false)
  const [filterDialog, setFilterDialog] = React.useState()
  const [editDialog, setEditDialog] = React.useState()
  const [editValue, setEditValue] = React.useState()

  const filterUpdate = v => setOrigin(v)

  const editUpdate = () => echartsUpdate()

  const echartsUpdate = () => {
    const data = origin ? format({ [origin]: Imitation.state.library[origin] }, [], parseDirection(direction)[1]) : []

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
          expandAndCollapse: edit ? false : true,
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
  }

  React.useEffect(() => {
    refEcharts.current = echarts.init(ref.current)
  }, [])

  React.useEffect(() => {
    echartsUpdate()
  }, [origin, direction, edit, editValue])

  React.useEffect(() => {
    if (!edit) return null

    const event = (params) => {
      setEditDialog(true)
      setEditValue(params.data)
    }

    refEcharts.current.on('click', event)

    return () => refEcharts.current.off('click', event)
  }, [edit])

  React.useEffect(() => {
    if (Imitation.state.library) requestAnimationFrame(() => setOrigin(Object.keys(Imitation.state.library)[0]))
  }, [])

  React.useEffect(() => {
    const observer = new ResizeObserver(en => refEcharts.current.resize())

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return <>

    <div style={{ width: '100%', height: 'calc(100% - 64px)' }} ref={el => ref.current = el}></div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ margin: '0 4px' }} onClick={() => setFilterDialog(true)}><FilterAltIcon /></Button>
      <Button variant={direction === 'RL' ? 'contained' : 'outlined'} style={{ margin: '0 4px' }} onClick={() => setDirection('RL')}><PlayArrowIcon style={{ transform: 'rotate(180deg)' }} /></Button>
      <Button variant={direction === 'LR' ? 'contained' : 'outlined'} style={{ margin: '0 4px' }} onClick={() => setDirection('LR')}><PlayArrowIcon /></Button>
      {/* <Button variant={edit ? 'contained' : 'outlined'} style={{ margin: '0 4px' }} onClick={() => setEdit(pre => !pre)}><EditIcon /></Button> */}
    </div>

    <FilterDialog open={Boolean(filterDialog)} onClose={() => setFilterDialog()} onUpdate={filterUpdate} />
    <EditDialog open={Boolean(editDialog)} onClose={() => setEditDialog()} onUpdate={editUpdate} value={editValue} />

  </>
}

export default App