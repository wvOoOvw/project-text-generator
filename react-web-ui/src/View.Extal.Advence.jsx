import React from 'react'

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import qr from '../static/qr.advence.png'

function Advence() {
  return <div style={{ textAlign: 'center' }}>
    <div style={{ marginBottom: 16 }}>
      论文咨询、作业辅导、毕设定制 可以添加下方的联系方式
    </div>
    <div style={{ marginBottom: 16 }}>
      <img src={qr} style={{ maxWidth: '100%', width: 240 }}></img>
    </div>
    <div style={{ marginBottom: 16 }}>
      wx：ZYDX-1881
    </div>
  </div>
}

function AdvenceDialog(props) {
  return <Dialog open={props.open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 720 } }} onClose={() => props.onClose()}>
    <DialogTitle>广告</DialogTitle>
    <DialogContent dividers>
      <Advence />
    </DialogContent>
  </Dialog>
}

export { Advence, AdvenceDialog }