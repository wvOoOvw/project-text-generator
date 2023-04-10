import React from 'react'

import Paper from '@mui/material/Paper'

import Imitation from './utils.imitation'
import { hash } from './utils.common'

function Neuron(props) {
  const mouseDownPosition = React.useRef(null)

  const onMouseDown = e => {
    if (Imitation.state.runContext) return

    e.stopPropagation()
    mouseDownPosition.current = { x: e.pageX, y: e.pageY }
  }

  const onMouseUp = e => {
    if (Imitation.state.runContext) return

    e.stopPropagation()
    mouseDownPosition.current = null
  }

  const onMouseMove = e => {
    if (Imitation.state.runContext) return
    if (!mouseDownPosition.current) return

    const changeX = (e.pageX) - mouseDownPosition.current.x
    const changeY = (e.pageY) - mouseDownPosition.current.y
    mouseDownPosition.current = { x: mouseDownPosition.current.x + changeX, y: mouseDownPosition.current.y + changeY }

    const neuron = Imitation.state.context.neuron.find(i => i.id === props.neuron.id)

    neuron.x = Math.round(neuron.x + changeX / Imitation.state.context.neuronViewport.scale)
    neuron.y = Math.round(neuron.y + changeY / Imitation.state.context.neuronViewport.scale)

    Imitation.dispatch()
  }

  const onMouseEnter = e => {
    Imitation.state.neuronMouseEnter = props.neuron
    Imitation.dispatch()
  }

  const onMouseLeave = e => {
    Imitation.state.neuronMouseEnter = null
    Imitation.dispatch()
  }

  const onClick = e => {
    if (Imitation.state.runContext) return

    e.stopPropagation()

    if (!Imitation.state.neuronLinkAction) return
    if (Imitation.state.neuronLinkAction.neuron === props.neuron) return
    if (Imitation.state.context.neuronLink.find(i => i.from === Imitation.state.neuronLinkAction.neuron.id && i.to === props.neuron.id)) return

    Imitation.state.context.neuronLink.push({ id: hash(), from: Imitation.state.neuronLinkAction.neuron.id, to: props.neuron.id })
    Imitation.state.neuronLinkAction = null
    Imitation.dispatch()
  }

  const onDoubleClick = e => {
    e.stopPropagation()

    if (Imitation.state.runContext) return
    if (Imitation.state.neuronLinkAction) return

    Imitation.state.neuronInformationAction = props.neuron
    Imitation.dispatch()
  }

  const onClickLink = e => {
    if (Imitation.state.runContext) return
    if (Imitation.state.neuronLinkAction) return

    Imitation.state.neuronLinkAction = { neuron: props.neuron, position: { x: e.pageX, y: e.pageY } }
    Imitation.dispatch()
  }

  const opacity = React.useMemo(() => {
    if (Imitation.state.neuronLinkAction && Imitation.state.neuronLinkAction.neuron === props.neuron) return 0.5
    if (Imitation.state.neuronLinkAction && Imitation.state.neuronMouseEnter === props.neuron) return 0.5
    return 1
  })

  const background = React.useMemo(() => {
    if (Imitation.state.neuronInformationAction === props.neuron) return 'rgb(230, 235, 240)'
    if (Imitation.state.runLogMouseEnterArray.find(i => i.neuron.id === props.neuron.id)) return 'rgb(230, 235, 240)'
    return 'rgb(255, 255, 255)'
  })

  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [props.neuron.id])

  return <Paper style={{ position: 'absolute', inset: 0, margin: 'auto', zIndex: 2, width: 120, height: 'fit-content', padding: 16, transform: `translate(${props.neuron.x}px, ${props.neuron.y}px) scale(1)`, opacity: opacity, background: background, transitionDuration: '0.5s', transitionProperty: 'opacity, background' }} onClick={onClick} onMouseDown={onMouseDown} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onDoubleClick={onDoubleClick}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 14, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {
          props.neuron.name
        }
      </div>

      <div style={{ cursor: 'pointer', width: 8, height: 8, flexShrink: 0, marginLeft: 4, background: 'green', borderRadius: '50%' }} onClick={onClickLink} onMouseDown={e => e.stopPropagation()} onMouseUp={e => e.stopPropagation()} />
    </div>

    <div style={{ position: 'absolute', left: 4, top: 4, width: 8, height: 8, borderRadius: '50%', background: props.neuron.isOrigin ? 'rgb(180, 0, 0)' : 'rgb(0, 0, 180)', opacity: props.neuron.isOrigin || props.neuron.isDestination ? 1 : 0, transition: '0.5s all' }} />
    <div style={{ position: 'absolute', left: 16, top: 4, width: 8, height: 8, borderRadius: '50%', background: 'rgb(180, 180, 0)', opacity: props.neuron.isLazy ? 1 : 0, transition: '0.5s all' }} />

    {
      Imitation.state.runContext ?
        <>
          {/* {
            Imitation.state.runContext.log.filter(i => i.neuron && (i.neuron.id === props.neuron.id)).map((i, index) => {
              return <div style={{ position: 'absolute', left: 8, bottom: `calc(100% + ${8 + index * 16}px)`, color: 'rgba(0, 0, 0, 0.5)', fontSize: 12 }} key={index}>
                {JSON.stringify(i.input)} {i.input && i.output ? '-' : ''} {JSON.stringify(i.output)}
              </div>
            })
          } */}

          {/* {
            Imitation.state.runContext.log.filter(i => i.neuron && (i.neuron.id === props.neuron.id)).map((i, index) => {
              return <div style={{ position: 'absolute', right: 8, top: `calc(100% + ${8 + index * 16}px)`, color: 'rgba(0, 0, 0, 0.5)', fontSize: 12 }} key={index}>
                {JSON.stringify(i.output)}
              </div>
            })
          } */}
        </>
        : null
    }


  </Paper>
}

function App() {
  return Imitation.state.context.neuron.map((i) => <Neuron key={i.id} neuron={i} />)
}

export default App