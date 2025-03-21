import React, { useState } from 'react'
import { Button } from '@mui/material';

function Home() {
  let [lightMode, setMode] = useState(true)
  function changeMode() {
    setMode(prevmode => !prevmode);
  }
  const bodyStyle = {
    display: 'flex', 
    gap: '40px', 
    backgroundColor: lightMode ? "white" : "black", 
    color: lightMode ? "black" : "white"
  }

  
  return (
    <>
      <div style={{...bodyStyle}}>
        <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</div>
        <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam quaerat vero debitis asperiores natus. Ipsam sunt iusto labore. Beatae ea inventore expedita, temporibus velit quisquam nam eos provident perspiciatis repudiandae?</div>
      </div>
      <Button onClick={changeMode}>Change Mode</Button>
    </>
  )
}

export default Home
