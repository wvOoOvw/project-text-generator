import React from 'react'

import Imitation from './utils.imitation'

import Paper from '@mui/material/Paper'

const Default = React.lazy(() => import('./View.Pane.Playground.Default'))
const Table = React.lazy(() => import('./View.Pane.Playground.Table'))
const Graph = React.lazy(() => import('./View.Pane.Playground.Graph'))
const Train = React.lazy(() => import('./View.Pane.Playground.Train'))
const Run = React.lazy(() => import('./View.Pane.Playground.Run'))
const Example = React.lazy(() => import('./View.Pane.Playground.Example'))

function SuspenseLoading() {
  React.useEffect(() => {
    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })
    return () => {
      Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
    }
  }, [])

  return null
}

function App() {
  return <Paper style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 1)', position: 'relative' }}>

    {
      Imitation.state.playgroundView === 'default' ? <React.Suspense fallback={<SuspenseLoading />} children={<Default />} /> : null
    }

    {
      Imitation.state.playgroundView === 'table' ? <React.Suspense fallback={<SuspenseLoading />} children={<Table />} /> : null
    }

    {
      Imitation.state.playgroundView === 'graph' ? <React.Suspense fallback={<SuspenseLoading />} children={<Graph />} /> : null
    }

    {
      Imitation.state.playgroundView === 'train' ? <React.Suspense fallback={<SuspenseLoading />} children={<Train />} /> : null
    }

    {
      Imitation.state.playgroundView === 'run' ? <React.Suspense fallback={<SuspenseLoading />} children={<Run />} /> : null
    }

    {
      Imitation.state.playgroundView === 'example' ? <React.Suspense fallback={<SuspenseLoading />} children={<Example />} /> : null
    }

  </Paper>
}

export default App