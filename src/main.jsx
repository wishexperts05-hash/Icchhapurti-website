import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './i18n.js';
import { HeaderProvider } from './context/HeaderContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeaderProvider>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </HeaderProvider>
  </StrictMode>
)
