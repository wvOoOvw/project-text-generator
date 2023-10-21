import React from 'react'
import { HashRouter } from 'react-router-dom'

import Message from './View.Global.Message'
import Loading from './View.Global.Loading'
import Wave from './View.Global.Wave'

import Imitation from './utils.imitation'

import Navigation from './View.Navigation'
import Page from './View.Page.Content'

function App() {
  return <>
    <HashRouter>
      <Loading />
      <Message />
      <Wave />
      <Navigation />
      <Page />
    </HashRouter>
  </>
}

export default Imitation.withBindRender(App)