import './App.css'
import Auth from './components/Auth'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/pages/Home'
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="login-signup" element={<Auth/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
