import React from 'react'

import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'

import DescriptionIcon from '@mui/icons-material/Description';

import Imitation from './utils.imitation'

import example from './example'

function App() {
  const [filter, setFilter] = React.useState('')

  const apply =  async (v) => {

    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const library =  await v.library().then(res => res.default)
    // Imitation.state.playgroundView = 'run'
    Imitation.state.library = library
    Imitation.state.trainPrompt = v.trainPrompt ? v.trainPrompt : ''
    Imitation.state.runPrompt = v.runPrompt ? v.runPrompt : ''
    Imitation.state.message = 'Loaded'

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
  }

  return <>

    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div style={{ height: 'fit-content', margin: 16 }}>
        <Grid container spacing={2}>
          {
            example.filter(i => i.name.includes(filter)).map((i, index) => {
              return <Grid item key={index}>
                <Card onClick={() => apply(i)}>
                  <CardActionArea>
                    <CardContent style={{ width: 320, height: 220, position: 'relative' }}>

                      <Tooltip title={i.name}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 16, marginRight: 8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {i.name}
                          </div>
                          <Badge badgeContent={i.recordContextLength} color="primary">
                            <DescriptionIcon style={{ flexShrink: 0 }} />
                          </Badge>
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