import React from 'react'

import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import Button from '@mui/material/Button'

import FilterAltIcon from '@mui/icons-material/FilterAlt'

import Imitation from './utils.imitation'

import example from '../example/example'

function App() {
  const [origin, setOrigin] = React.useState([])
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(60)

  const apply = async (v) => {
    Imitation.setState(pre => { pre.loading = pre.loading + 1; return pre })

    const library = await v.library().then(res => res.default)
    Imitation.state.library = library
    Imitation.state.message = 'Loaded'

    Imitation.setState(pre => { pre.loading = pre.loading - 1; return pre })
  }

  const count = React.useMemo(() => Math.ceil(origin.filter(i => i.name.includes(filter) || i.description.includes(filter)).length / pageSize), [origin, filter, pageSize])

  const renderList = React.useMemo(() => origin.filter(i => i.name.includes(filter) || i.description.includes(filter)).filter((i, index) => index >= (page - 1) * pageSize && index < page * pageSize), [origin, filter, pageSize, page])

  React.useEffect(() => setOrigin(example), [])

  React.useEffect(() => setPage(1), [filter, origin])

  return <>

    <div style={{ width: '100%', height: '100%', margin: 'auto', paddingBottom: 64, paddingTop: 68, overflow: 'auto' }}>
      <div style={{ height: 'fit-content', margin: 8, display: 'flex', justifyContent: 'center', alignContent: 'start', flexWrap: 'wrap' }}>

        {
          renderList.map((i, index) => {
            return <Card onClick={() => apply(i)} style={{ width: 320, maxWidth: '100%', height: 220, margin: 8 }} key={index}>
              <CardActionArea style={{ width: '100%', height: '100%' }}>
                <CardContent style={{ width: '100%', height: '100%' }}>
                  <div style={{ fontSize: 16, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {i.name}
                  </div>
                  <Divider style={{ margin: '16px 0' }} />
                  <div style={{ lineHeight: 1.5 }}>{i.description}</div>
                </CardContent>
              </CardActionArea>
            </Card>
          })
        }

      </div>
    </div>

    <div style={{ position: 'absolute', top: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Button fullWidth variant='contained' color='inherit' style={{ maxWidth: 720, height: 36, padding: 0, margin: '0px 16px', position: 'relative' }} component='div'>
        <FilterAltIcon style={{ position: 'absolute', left: 8, top: 0, bottom: 0, margin: 'auto' }} />
        <input style={{ width: '100%', height: '100%', textAlign: 'center', fontSize: 16, color: 'black', border: 'none', outline: 'none', background: 'none' }} autoComplete='off' value={filter} onChange={e => setFilter(e.target.value)} />
      </Button>
    </div>

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex', alignItems: 'center', width: '100%' }}>
      <Pagination color='primary' count={count === 0 ? 1 : count} page={page} onChange={(e, v) => setPage(v)} style={{ margin: 'auto', width: 'fit-content' }} />
    </div>

  </>
}

export default App