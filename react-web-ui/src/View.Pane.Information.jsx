import React from 'react'

import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import Imitation from './utils.imitation'
import { hash } from './utils.common'

function App() {
  const expendStyle = React.useMemo(() => {
    if (Imitation.state.infromationExpand) return { width: 240, marginRight: 16 }
    if (!Imitation.state.infromationExpand) return { width: 0, marginRight: 0 }
  })

  React.useEffect(() => {
    if (Imitation.state.neuronInformationAction) {
      Imitation.state.infromationExpand = true
      Imitation.dispatch()
    }
  }, [Imitation.state.neuronInformationAction])

  return <Paper style={{ position: 'relative', height: '100%', overflow: 'hidden', background: 'rgba(255, 255, 255, 1)', transition: '0.5s all', overflow: 'hidden', ...expendStyle }}>
    <div style={{ width: 240, height: '100%', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>

      {/* {
        !Imitation.state.runContext && Imitation.state.neuronInformationAction ? <NeuronInformation /> : null
      }

      {
        !Imitation.state.runContext && !Imitation.state.neuronInformationAction ? <Summary /> : null
      }

      {
        Imitation.state.runContext ? <Log /> : null
      } */}

    </div> 
  </Paper >
}

export default App