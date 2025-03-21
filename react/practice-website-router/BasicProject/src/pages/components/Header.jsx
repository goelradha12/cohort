import * as React from 'react';
import PropTypes from 'prop-types';
import {AppBar, Button, colors} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import './headerStyles.css'


function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}


HideOnScroll.propTypes = {
  children: PropTypes.element,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function HideAppBar(props) {
    
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
        <MenuIcon
        sx={{mr:2}}/>
            <Typography variant="h6" component="div">
              Websites With Wordpress
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow:'1'}}>
            <NavLink style={{color:"white"}} className={({isActive})=>(isActive?'activeLink':'')} to="/">Home</NavLink>
            <NavLink style={{color:"white"}} className={({isActive})=>(isActive?'activeLink':'')} to="/about">About</NavLink>
            <NavLink style={{color:"white"}} className={({isActive})=>(isActive?'activeLink':'')} to="/project">Project</NavLink>
            <NavLink style={{color:"white"}} className={({isActive})=>(isActive?'activeLink':'')} to="/contact">Contact Us</NavLink>
          </Box>
           
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </React.Fragment>

  );
}
