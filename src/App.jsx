import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Contacts from './components/Contacts/Contacts'
import Menu from './components/Menu/Menu'
import Accounts from './components/Accounts/Accounts'
import Payments from './components/Payments/Payments'

function App() {

  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/contacts' element={<Contacts />}/>
        <Route path='/accounts' element={<Accounts />}/>
        <Route path='/payments' element={<Payments />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
