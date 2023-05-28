import React from 'react'

import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'

import DescriptionIcon from '@mui/icons-material/Description'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

import Imitation from './utils.imitation'

import example from './example'

function App() {
  const [origin, setOrigin] = React.useState([])
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(60)

  const apply = async (v) => {
    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const library = await v.library().then(res => res.default)
    Imitation.state.library = library
    Imitation.state.trainPrompt = v.trainPrompt ? v.trainPrompt : ''
    Imitation.state.generatePrompt = v.generatePrompt ? v.generatePrompt : ''
    Imitation.state.message = 'Loaded'

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
  }

  const count = React.useMemo(() => Math.ceil(origin.filter(i => i.name.includes(filter) || i.description.includes(filter)).length / pageSize), [origin, filter, pageSize])

  const renderList = React.useMemo(() => origin.filter(i => i.name.includes(filter) || i.description.includes(filter)).filter((i, index) => index >= (page - 1) * pageSize && index < page * pageSize), [origin, filter, pageSize, page])

  React.useEffect(() => setOrigin(example), [])
  React.useEffect(() => setPage(1), [filter])

  return <>

    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div style={{ height: 'fit-content', margin: 16 }}>

        <Grid container spacing={2} justifyContent='center'>

          {
            origin ?
              <Grid item xs={12}>
                <div style={{ maxWidth: 720, margin: 'auto', display: 'block', position: 'relative' }}>
                  <TextField variant='standard' sx={{ '& input': { fontSize: 16, textAlign: 'center' } }} autoComplete='off' fullWidth value={filter} onChange={e => setFilter(e.target.value)} />
                  <FilterAltIcon style={{ position: 'absolute', left: 4, top: 0, bottom: 0, margin: 'auto' }} />
                </div>
              </Grid>
              : null
          }

          {
            renderList.map((i, index) => {
              return <Grid item key={index}>
                <Card onClick={() => apply(i)}>
                  <CardActionArea>
                    <Tooltip title={i.name}>
                      <CardContent style={{ width: 320, maxWidth: '100%', height: 220, position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 16, marginRight: 8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {i.name}
                          </div>
                          <DescriptionIcon style={{ flexShrink: 0 }} />
                        </div>
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ lineHeight: 1.5 }}>{i.description}</div>
                      </CardContent>
                    </Tooltip>
                  </CardActionArea>
                </Card>
              </Grid>
            })
          }

          {
            count ?
              <Grid item xs={12}>
                <Pagination color='primary' count={count} page={page} onChange={(e, v) => setPage(v)} style={{ margin: 'auto', width: 'fit-content' }} />
              </Grid>
              : null
          }

        </Grid>

      </div>
    </div>

  </>
}

export default App