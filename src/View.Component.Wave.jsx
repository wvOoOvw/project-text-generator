import React from 'react'

function App() {
  return <div style={{ position: 'fixed', zIndex: -1, top: 0, width: '100%', height: '100%' }} >
    <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
      <svg
        style={{ position: 'relative', width: '100%', height: Math.max(window.innerWidth * 0.05, 40), marginBottom: '-7px' }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
        </defs>
        <g>
          <use style={{ animation: 'wave 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-2s', animationDuration: '7s' }} xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(25, 118, 210, 0.5)"></use>
          <use style={{ animation: 'wave 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-3s', animationDuration: '10s' }} xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(25, 118, 210, 0.25)"></use>
          <use style={{ animation: 'wave 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-4s', animationDuration: '13s' }} xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(25, 118, 210, 0.5)"></use>
          <use style={{ animation: 'wave 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-5s', animationDuration: '20s' }} xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(25, 118, 210, 0.25)"></use>
        </g>
      </svg>
    </div>
  </div >
}

export default App