import React from 'react'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer';

import Imitation from './utils.imitation'

function App() {
  const [update, setUpdate] = React.useState(0)
  const [drawer, setDrawer] = React.useState(false)

  const clear = () => {
    Imitation.state.library = [[], [], {}]
    Imitation.state.train = ''
    Imitation.state.run = ''
    Imitation.state.message = 'Cleared'
    Imitation.dispatch()
  }

  return <Paper style={{ position: 'relative', width: '100%', height: 'fit-content', overflow: 'auto', background: 'rgba(255, 255, 255, 1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 16 }}>

    {
      window.innerWidth > 720 || window.innerWidth === 720 ?
        <>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'default'; return pre })}>Home</Button>
            <Button variant='outlined' style={{ textTransform: 'none', marginRight: 8 }} onClick={clear}>Clear Storage</Button>
            {/* <Button variant='outlined' style={{ textTransform: 'none', marginRight: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'price'; return pre })}>Price</Button> */}
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button variant={Imitation.state.playgroundView === 'example' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'example'; return pre })}>Example</Button>
            <Button variant={Imitation.state.playgroundView === 'information' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'information'; return pre })}>Information</Button>
            <Button variant={Imitation.state.playgroundView === 'train' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'train'; return pre })}>Train</Button>
            <Button variant={Imitation.state.playgroundView === 'run' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'run'; return pre })}>Generate</Button>
          </div>
        </>
        : null
    }

    {
      window.innerWidth < 720 ?
        <>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button variant='contained' style={{ textTransform: 'none', marginRight: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'default'; return pre })}>Home</Button>
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button variant={'outlined'} style={{ textTransform: 'none', marginLeft: 8 }} onClick={() => setDrawer(true)}>Menu</Button>
          </div>

          {
            <Drawer anchor='left' open={drawer} onClose={() => setDrawer(false)} sx={{ '& .MuiPaper-root': { width: 304, height: '100%' } }}>
              <div style={{ flexShrink: 0, height: '100%', padding: 16, overflow: 'auto' }}>
                <Button fullWidth variant='contained' style={{ textTransform: 'none', marginBottom: 8 }} onClick={clear}>Clear Storage</Button>
                <Button fullWidth variant={Imitation.state.playgroundView === 'example' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginBottom: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'example'; return pre })}>Example</Button>
                <Button fullWidth variant={Imitation.state.playgroundView === 'information' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginBottom: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'information'; return pre })}>Information</Button>
                <Button fullWidth variant={Imitation.state.playgroundView === 'train' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginBottom: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'train'; return pre })}>Train</Button>
                <Button fullWidth variant={Imitation.state.playgroundView === 'run' ? 'contained' : 'outlined'} style={{ textTransform: 'none', marginBottom: 8 }} onClick={() => Imitation.setState(pre => { pre.playgroundView = 'run'; return pre })}>Generate</Button>
              </div>
            </Drawer>
          }
        </>
        : null
    }

  </Paper>
}

export default App