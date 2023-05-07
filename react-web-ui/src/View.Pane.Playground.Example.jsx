import React from 'react'

import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip';

import DescriptionIcon from '@mui/icons-material/Description';

import Imitation from './utils.imitation'

import example from './example'

function App() {
  const [filter, setFilter] = React.useState('')

  const apply = v => {
    Imitation.state.playgroundView = 'run'
    Imitation.state.library = v
    Imitation.state.message = 'Loaded'
    Imitation.dispatch()
  }

  return <>

    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div style={{ height: 'fit-content', margin: 16 }}>
        <Grid container spacing={2}>
          {
            example.filter(i => i.name.includes(filter)).map((i, index) => {
              return <Grid item key={index}>
                <Card onClick={() => apply(i.data)}>
                  <CardActionArea>
                    <CardContent style={{ width: 320, height: 220, overflow: 'hidden' }}>

                      <Tooltip title={i.name}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 16, marginRight: 8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {i.name}
                          </div>
                          <DescriptionIcon style={{ flexShrink: 0 }} />
                        </div>
                      </Tooltip>

                      <Divider style={{ margin: '16px 0' }} />

                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{i.description}</div>

                    </CardContent>
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