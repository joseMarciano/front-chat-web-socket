import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ChatContext } from './components/chat/Context'



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <BrowserRouter>
    <ChatContext>
      <App />
    </ChatContext>
  </BrowserRouter>
)
