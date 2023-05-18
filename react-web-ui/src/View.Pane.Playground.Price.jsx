import React from 'react'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Imitation from './utils.imitation'

import { safeNumber } from './utils.common'

const priceDefault = () => {
  return [
    {
      name: 'type',
      type: 'Select',
      value: 'paper',
      option: [
        { value: 'paper', label: 'paper' },
        { value: 'application', label: 'application' },
      ],
      onChange: (map, current, value) => current.value = value,
      visible: (map) => true,
      price: (map, current) => 0
    },
    {
      name: 'word count',
      type: 'Slider',
      value: 1000,
      min: 1000,
      max: 50000,
      step: 100,
      onChange: (map, current, value) => current.value = value,
      visible: (map) => map.find(i => i.name === 'type').value === 'paper',
      price: (map, current) => current.value / 1000 * 100
    },
  ]
}

function App() {
  const [priceMap, setPriceMap] = React.useState(priceDefault())
  const [price, setPrice] = React.useState(0)

  const reset = () => setPriceMap(priceDefault())

  React.useEffect(() => setPrice(priceMap.reduce((t, i) => i.visible(priceMap) ? t + i.price(priceMap, i) : t, 0)), [priceMap])

  return <>

    <div style={{ width: '100%', height: 'calc(100% - 64px)', margin: 'auto', padding: 16, maxWidth: 1080, overflowX: 'visible', overflowY: 'auto' }}>
      <Grid container spacing={2}>

        {
          priceMap.map((i, index) => {
            if (i.visible(priceMap) === false) return null

            if (i.type === 'Select') {
              return <React.Fragment key={index}>
                <Grid item xs={12} style={{ fontSize: 16 }}>{i.name}</Grid>
                <Grid item xs={12}>
                  <Select fullWidth value={i.value} onChange={e => { i.onChange(priceMap, i, e.target.value); setPriceMap([...priceMap]) }} >
                    {
                      i.option.map((i, index) => {
                        return <MenuItem value={i.value} key={index}>{i.label}</MenuItem>
                      })
                    }
                  </Select>
                </Grid>
              </React.Fragment>
            }

            if (i.type === 'Slider') {
              return <React.Fragment key={index}>
                <Grid item xs={12} style={{ fontSize: 16 }}>{i.name} {i.value}</Grid>
                <Grid item xs={12}>
                  <Slider value={i.value} onChange={(e, v) => { i.onChange(priceMap, i, v); setPriceMap([...priceMap]) }} min={i.min} max={i.max} step={i.step} valueLabelDisplay='auto' />
                </Grid>
              </React.Fragment>
            }

            if (i.type === 'TextField') {
              return <Grid item xs={12} key={index}>
                <TextField fullWidth variant='standard' value={props.setting.stopToken} onChange={e => props.setSetting(pre => { pre.stopToken = e.target.value; return { ...pre } })} />
              </Grid>
            }

            if (i.type === 'TextField') {
              return <Grid item xs={12} key={index}>
                <Switch checked={props.setting.append} onChange={(e) => props.setSetting(pre => { pre.append = e.target.checked; return { ...pre } })} />
              </Grid>
            }
          })
        }

      </Grid>
    </div >

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 8px' }} onClick={reset}>Reset</Button>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 8px' }}>Price {safeNumber(price)}</Button>
    </div>

  </>
}

export default App