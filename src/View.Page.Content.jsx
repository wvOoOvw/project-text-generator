import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Imitation from './utils.imitation'

const Default = React.lazy(() => import('./View.Page.Content.Default'))
const Train = React.lazy(() => import('./View.Page.Content.Train'))
const Generate = React.lazy(() => import('./View.Page.Content.Generate'))

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
  return <>
    <Switch>
      <Route path={'/'} exact><React.Suspense fallback={<SuspenseLoading />} children={<Default />} /></Route>
      <Route path={'/train'} exact><React.Suspense fallback={<SuspenseLoading />} children={<Train />} /></Route>
      <Route path={'/generate'} exact><React.Suspense fallback={<SuspenseLoading />} children={<Generate />} /></Route>
    </Switch>
  </>
}

export default App