import React from 'react'

import fingerprintjs from'@fingerprintjs/fingerprintjs'

import Message from './View.Global.Message'
import Loading from './View.Global.Loading'

import Imitation from './utils.imitation'

import Menu from './View.Pane.Menu'
import Playground from './View.Pane.Playground'
import Advence from './View.Extal.Advence'

function App() {
  React.useEffect(() => {
    fingerprintjs.load().then(res => res.get()).then(res => console.log(res))
  }, [])

  React.useEffect(() => {
    window.addEventListener('resize', () => Imitation.dispatch())
  }, [])

  return <>
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, margin: 'auto', padding: 16, background: 'rgb(230, 235, 240)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: 'fit-content' }}>
        <Menu />
      </div>
      <div style={{ width: '100%', height: 0, flexGrow: 1, display: 'flex' }}>
        <Playground />
      </div>
    </div>

    <Message />
    <Loading />

    <Advence open={Imitation.state.advence} onClose={() => Imitation.setState(pre => { pre.advence = false; return pre })} />

  </>
}

export default Imitation.withBindRender(App)