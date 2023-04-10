import React from 'react'

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

import Imitation from './utils.imitation'
import { hash } from './utils.common'

const offsetNeuronLine = (item) => {
  return { ...item, x: item.x + Imitation.state.refCanvas.current.offsetWidth / 2 + 40, y: item.y + Imitation.state.refCanvas.current.offsetHeight / 2 }
}

function RemoveDialog(props) {
  return <Dialog open={true} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 480 } }} onClose={props.onClose}>
    <DialogTitle>
      <div style={{ fontSize: 16 }}>Will Remove Neuron Link</div>
    </DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>From:</div>
            <div>{Imitation.state.context.neuron.find(i => i.id === props.neuronLink.from).name}</div>
          </div>
        </Grid>
        <Grid item xs={12} style={{ fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>To:</div>
            <div>{Imitation.state.context.neuron.find(i => i.id === props.neuronLink.to).name}</div>
          </div>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' color='error' onClick={props.onClick}>Yes</Button>
      <Button variant='contained' onClick={props.onClose}>No</Button>
    </DialogActions>
  </Dialog>
}

function NeuronLink(props) {
  const refColor = React.useRef(hash())

  const [removeDialog, setRemoveDialog] = React.useState(false)

  const openRemoveDialog = () => {
    if (Imitation.state.runContext) return

    setRemoveDialog(true)
  }

  const remove = () => {
    Imitation.state.context.neuronLink = Imitation.state.context.neuronLink.filter(i_ => i_.id !== props.neuronLink.id)
    Imitation.dispatch()
  }

  const [x, y, x_, y_] = React.useMemo(() => {
    return [props.from.x, props.from.y, props.to.x, props.to.y]
  })

  const [x__, y__] = React.useMemo(() => {
    if (props.from.x >= props.to.x) var x = Math.min(props.from.x, props.to.x)
    if (props.from.x <= props.to.x) var x = Math.max(props.from.x, props.to.x)
    if (props.from.y >= props.to.y) var y = Math.max(props.from.y, props.to.y)
    if (props.from.y <= props.to.y) var y = Math.min(props.from.y, props.to.y)
    return [x, y]
  })

  const d = React.useMemo(() => {
    return `M ${Math.round(x)} ${Math.round(y)} Q ${Math.round(x__)} ${Math.round(y__)} ${Math.round(x_)} ${Math.round(y_)} Q ${Math.round(x__)} ${Math.round(y__)} ${Math.round(x)} ${Math.round(y)} Z`
  })

  const color = React.useMemo(() => {
    if (props.color) return props.color
    return ['black', 'red']
  })

  const strokeDasharray = React.useMemo(() => {
    if (Imitation.state.neuronLinkInformationMouseEnter && props.neuronLink && Imitation.state.neuronLinkInformationMouseEnter.id === props.neuronLink.id) return '2 4'
    if (Imitation.state.runLogMouseEnterArray.find(i => (i.from && i.from.find(i => i.id === props.neuronLink.from) && i.neuron.id === props.neuronLink.to) || (i.to && i.to.find(i => i.id === props.neuronLink.to) && i.neuron.id === props.neuronLink.from))) return '2 4'
    // if (Imitation.state.runContext && Imitation.state.runContext.log.find(i => i.neuron.id === props.neuronLink.from || i.neuron.id === props.neuronLink.to)) return '2 4'
    return '1 0'
  })

  const strokeWidth = React.useMemo(() => {
    return '1'
  })

  return <>
    <defs>
      <linearGradient id={refColor.current} x1={String(x / Imitation.state.refCanvas.current.offsetWidth)} y1={String(y / Imitation.state.refCanvas.current.offsetHeight)} x2={String(x_ / Imitation.state.refCanvas.current.offsetWidth)} y2={String(y_ / Imitation.state.refCanvas.current.offsetHeight)}>
        <stop offset='20%' stopColor={color[0]} />
        <stop offset='80%' stopColor={color[1]} />
      </linearGradient>
    </defs>

    <path d={d} style={{ fill: 'transparent', stroke: `url(#${refColor.current})`, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, cursor: 'pointer', transitionDuration: '0.5s', transitionProperty: 'stroke-dasharray, stroke-width' }} onClick={openRemoveDialog} />

    {
      removeDialog ? <RemoveDialog neuronLink={props.neuronLink} onClick={remove} onClose={() => setRemoveDialog()} /> : null
    }
  </>
}

function Exist() {
  return Imitation.state.context.neuronLink.map((i) => <NeuronLink key={i.id} from={offsetNeuronLine(Imitation.state.context.neuron.find(i_ => i_.id === i.from))} to={offsetNeuronLine(Imitation.state.context.neuron.find(i_ => i_.id === i.to))} neuronLink={i} />)
}

function Action() {
  const mouseDownPosition = React.useRef(null)
  const fromPosition = React.useRef(null)
  const toPosition = React.useRef(null)

  const [update, setUpdate] = React.useState(0)

  const onMouseMove = e => {
    if (Imitation.state.runContext) return

    const changeX = (e.pageX) - mouseDownPosition.current.x
    const changeY = (e.pageY) - mouseDownPosition.current.y
    mouseDownPosition.current = { x: mouseDownPosition.current.x + changeX, y: mouseDownPosition.current.y + changeY }

    toPosition.current.x = Math.round(toPosition.current.x + changeX / Imitation.state.context.neuronViewport.scale)
    toPosition.current.y = Math.round(toPosition.current.y + changeY / Imitation.state.context.neuronViewport.scale)

    setUpdate(pre => pre + 1)
  }

  const color = React.useMemo(() => {
    if (Imitation.state.neuronMouseEnter && Imitation.state.neuronLinkAction && Imitation.state.neuronMouseEnter !== Imitation.state.neuronLinkAction.neuron) return ['black', 'green']
    return ['black', 'black']
  })

  React.useEffect(() => {
    if (!Imitation.state.neuronLinkAction) return null

    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [Imitation.state.neuronLinkAction])

  React.useEffect(() => {
    if (!Imitation.state.neuronLinkAction) {
      mouseDownPosition.current = null
      fromPosition.current = null
      toPosition.current = null
    }

    if (Imitation.state.neuronLinkAction) {
      mouseDownPosition.current = Imitation.state.neuronLinkAction.position
      fromPosition.current = offsetNeuronLine(Imitation.state.neuronLinkAction.neuron)
      toPosition.current = offsetNeuronLine(Imitation.state.neuronLinkAction.neuron)
    }

    setUpdate(pre => pre + 1)
  }, [Imitation.state.neuronLinkAction])

  if (!mouseDownPosition.current || !fromPosition.current || !toPosition.current) return null

  return <NeuronLink from={fromPosition.current} to={toPosition.current} color={color} />
}

function App() {
  return <svg style={{ position: 'absolute', inset: 0, margin: 'auto', zIndex: 1 }} width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <Action />
    <Exist />
  </svg>
}

export default App