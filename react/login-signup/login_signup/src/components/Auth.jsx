import React, { useState } from 'react'
import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { Login } from '@mui/icons-material'
const Auth = () => {
    let [formData, setFormData] = useState({
        Name: "",
        Email: "",
        Password: "",
    })
    let [isSignUp,setIsSignUp] = useState(false);

    function handleChange(e) {
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]: e.target.value ,}))
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formData);
    }


    return (
        <div>
            <form action="">
                <Box display={"flex"} border={'1px solid'} padding={'40px'} gap={'20px'} marginTop={'30px'} flexDirection={"column"} maxWidth={'400px'} justifyContent={'center'} alignItems={'stretch'} borderRadius={'10px'} marginInline={'auto'}
                    sx={{
                        ":hover": {
                            boxShadow: `10px 10px 20px rgba(0, 0, 0, 0.28)`
                        }
                    }}
                >
                    <Typography align='center' variant='h2' sx={{ fontSize: '2rem' }}>Login Form</Typography>

                    <Divider variant='middle' sx={{marginBottom:'20px'}}/>

                    {!isSignUp && <TextField value={formData.Name} name='Name' onChange={handleChange} variant='standard' placeholder='Name' type='text'></TextField>}
                    
                    <TextField value={formData.Email} name='Email'  variant='standard' onChange={handleChange} placeholder='Email' required type='email'></TextField>
                    
                    <TextField value={formData.Password} name='Password' variant='standard' onChange={handleChange} placeholder='Password' required type='password'></TextField>
                    
                    <Button variant='contained' type='submit' onClick={handleSubmit} size='large' endIcon={<Login />}>{isSignUp?`Signup`:`Login`}</Button>

                    <Typography 
                    align='center' 
                    variant='paragraph' 
                    onClick={()=>setIsSignUp(prev=>!prev)} 
                    sx={{cursor: 'pointer', 
                        ":hover":{color:'blue'}}}
                    >Change to {isSignUp?`Login`:`Signup`}</Typography>
                </Box>
            </form>
        </div>
    )
}

export default Auth
