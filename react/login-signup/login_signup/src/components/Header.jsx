import { AppBar, Box, Menu, MenuItem, Stack, Tab, Tabs, Toolbar, Typography, IconButton, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { StartOutlined, MenuBook, MenuBookOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navBarList = ["Home", "SignUp", "Login"];
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const handleChange = (e, val) => {
        setTabValue(val);
    }


    const [isMobile, setIsMobile] = useState(useMediaQuery('(max-width:600px)'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <AppBar position={"relative"}>
            <Toolbar sx={{ justifyContent: 'space-between', marginInline: '20px' }}>
                <Stack direction={'row'} alignItems={'center'}>
                    <StartOutlined sx={{ mr: '4px' }} />
                    <Typography variant="h6">Project Name</Typography>

                </Stack>
                {!isMobile && <Box>
                    <Stack>
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="warning"
                        >
                            <Tab sx={{ color: 'white' }} onClick={() => { navigate('/') }} label={navBarList[0]} />
                            <Tab sx={{ color: 'white' }} onClick={() => { navigate('login-signup') }} label={navBarList[1]} />
                            <Tab sx={{ color: 'white' }} onClick={() => { navigate('login-signup') }} label={navBarList[2]} />
                        </Tabs>
                    </Stack>
                </Box>
}

                {isMobile && (
                    <div>
                        <IconButton
                            size="large"
                            onClick={handleMenu}
                            sx={{paddingBlock: '20px'}}
                        >
                            <MenuBookOutlined />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {
                                handleClose();
                                navigate('/');
                            }}>{navBarList[0]} </MenuItem>
                            <MenuItem onClick={() => {
                                handleClose();
                                navigate('login-signup');
                            }}>{navBarList[1]} </MenuItem>
                            <MenuItem onClick={() => {
                                handleClose();
                                navigate('login-signup');
                            }}>{navBarList[2]} </MenuItem>
                        </Menu>
                    </div>
                )}

            </Toolbar>
        </AppBar>
    )
}

export default Header
