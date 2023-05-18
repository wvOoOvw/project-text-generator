import React from 'react'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import Imitation from './utils.imitation'

import { copy } from './utils.common'

function App() {

  const [type, setType] = React.useState(0)
  // const [promptLength, setPromptLength] = React.useState(1)
  // const [promptContent, setPromptContent] = React.useState([])
  // const [promptResult, setPromptResult] = React.useState([])

  // const computeResult = () => {

  // }

  // React.useEffect(() => setPromptContent(new Array(promptContent).fill().map(() => [])), [promptLength])
  // React.useEffect(() => computeResult(), [promptContent])

  const copy_ = () => {
    copy(JSON.stringify(Imitation.state.library))
    Imitation.setState(pre => { pre.message = 'Copy'; return pre })
  }

  return <>

    {/* {
        new Array(promptContent).fill().map((i, index) => {
          return <Button key={index} variant='contained' style={{ margin: 4 }}>{i ? i : '_____'}</Button>
        })
      } */}

    {
      type === 0 && Imitation.state.library[0][0] ?
        <div style={{ width: '100%', height: 'calc(100% - 64px)', margin: 'auto', padding: 16, maxWidth: 720, overflow: 'auto' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell>Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Imitation.state.library[0].map((i, index) => (
                  <TableRow key={index}>
                    <TableCell>{Imitation.state.library[0][index]}</TableCell>
                    <TableCell>{Imitation.state.library[1][index]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        : null
    }

    <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, margin: 'auto', width: 'fit-content', display: 'flex' }}>
      <Button variant='contained' style={{ textTransform: 'none', margin: '0 8px' }} onClick={copy_}>Copy</Button>
      <Button variant={type === 0 ? 'contained' : 'outlined'} style={{ textTransform: 'none', margin: '0 8px' }} onClick={() => setType(0)}>Token Frequency</Button>
    </div>

  </>
}

export default App