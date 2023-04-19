import React from 'react'

import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'

import FolderIcon from '@mui/icons-material/Folder';
import SendIcon from '@mui/icons-material/Send';

import Imitation from './utils.imitation'

import example from './example'

function App() {
  const [filter, setFilter] = React.useState('')

  const apply = v => {
    Imitation.state.library = v
    Imitation.state.message = 'Loaded'
    Imitation.dispatch()
  }

  return <>

    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div style={{ height: 'fit-content', margin: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            Example
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {
            Object.entries(example).filter(i => i[0].includes(filter)).map((i, index) => {
              return <Grid item key={index}>
                <Card onClick={() => apply(i[1])}>
                  <CardActionArea style={{ height: 160, width: 320, padding: 16, lineHeight: 1, fontSize: 14 }}>{i[0]}</CardActionArea>
                </Card>
              </Grid>
            })
          }
        </Grid>
      </div>
    </div>

  </>
}

export default App