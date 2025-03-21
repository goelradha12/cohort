import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
function About() {
    const copyTextHandler = ()=>{
        
    }
    return (
        <div>
            <Box sx={{ p: 2 }}>
                <Typography align='center' variant='h2'>

                    Password Generator
                </Typography>

            </Box>
            <Container>
                <span id="#resultedPassword"></span>
                <Button onClick={copyTextHandler} variant='contained'>Copy</Button>
            </Container>
            <Container>

            </Container>
        </div>
    )
}

export default About
