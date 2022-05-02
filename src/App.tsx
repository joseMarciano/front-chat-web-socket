import { Routes, Route } from 'react-router-dom'
import { Chat } from './components/chat'
import { Home } from './components/Home'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/chat/:id' element={<Chat/>} />
    </Routes>
  )
}

export default App
