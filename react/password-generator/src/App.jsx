import { IceSkatingOutlined } from '@mui/icons-material';
import Header from './components/Header'
import { Button, TextField } from '@mui/material';

function App() {
  return (
    <>
      <Header></Header>
      <div>
        <TextField></TextField>
        <Button color='secondary' startIcon={<IceSkatingOutlined/>}>Generate Password</Button>
      </div>
    </>
  );
}

export default App;
