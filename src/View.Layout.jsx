import React from 'react'
import { HashRouter } from 'react-router-dom'

import Message from './View.Global.Message'
import Loading from './View.Global.Loading'

import Imitation from './utils.imitation'

import Navigation from './View.Navigation'
import Page from './View.Page.Content'
import Wave from './View.Component.Wave'

function App() {
  return <>
    <HashRouter>
      <Loading />
      <Message />
      <Navigation />
      <Page />
      <Wave />
    </HashRouter>
  </>
}

export default Imitation.withBindRender(App)