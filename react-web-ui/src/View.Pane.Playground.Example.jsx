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
import CardContent from '@mui/material/CardContent';

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
            example.filter(i => i.name.includes(filter)).map((i, index) => {
              return <Grid item key={index}>
                <Card onClick={() => apply(i.data)}>
                  <CardActionArea style={{ width: 320, padding: 16 }}>
                    <div style={{ fontSize: 20 }}>{i.name}</div>
                    <div style={{ marginTop: 16, height: 120 }}>{i.description}</div>
                  </CardActionArea>
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