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
import Slider from '@mui/material/Slider';

import SendIcon from '@mui/icons-material/Send'
import SettingsIcon from '@mui/icons-material/Settings'

import * as echarts from 'echarts'
import * as Diff from 'diff'

import Imitation from './utils.imitation'

import Table from './View.Pane.Playground.Table'
import Graph from './View.Pane.Playground.Graph'
import Train from './View.Pane.Playground.Train'
import Run from './View.Pane.Playground.Run'

function App() {
  return <>

    {
      Imitation.state.playgroundView === 'table' ? <Table /> : null
    }

    {
      Imitation.state.playgroundView === 'graph' ? <Graph /> : null
    }

    {
      Imitation.state.playgroundView === 'train' ? <Train /> : null
    }

    {
      Imitation.state.playgroundView === 'run' ? <Run /> : null
    }

  </>
}

export default App