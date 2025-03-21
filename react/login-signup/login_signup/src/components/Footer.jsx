import { Box, Button, Stack, Toolbar, Typography } from '@mui/material'
import { StartOutlined } from '@mui/icons-material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ padding: '50px', backgroundColor: 'black', color: 'white', borderRadius:'10px 10px 0 0', marginTop: '50px'}}>
            <Stack minHeight={'200px'} maxWidth='1100px' width='80%' marginInline="auto">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box>
                        <StartOutlined />
                        <Typography variant={'body2'}>LoremIpsum text is here to make you belienve us
                        </Typography>
                    </Box>
                    <Box>
                        <Stack>
                            <Typography variant={'h6'} align='center' sx={{ fontWeight: "normal" }}>Menu</Typography>
                            <Button onClick={() => { navigate('') }} variant='text' sx={{ ":hover": { opacity: '0.6' }, padding: '0', marginBlock: '4px' }}>Home</Button>
                            <Button onClick={() => { navigate('') }} variant='text' sx={{ ":hover": { opacity: '0.6' }, padding: '0', marginBlock: '4px' }}>About</Button>
                            <Button onClick={() => { navigate('login-signup') }} variant='text' sx={{ ":hover": { opacity: '0.6' }, padding: '0', marginBlock: '4px' }}>SignUp</Button>
                            <Button onClick={() => { navigate('login-signup') }} variant='text' sx={{ ":hover": { opacity: '0.6' }, padding: '0', marginBlock: '4px' }}>Login</Button>
                        </Stack>
                    </Box>
                </Toolbar>
            </Stack>
        </Box>
    )
}

export default Footer
