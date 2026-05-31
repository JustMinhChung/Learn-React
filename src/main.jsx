import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HRProvider } from './contexts/HRContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HRProvider>
      <App />
    </HRProvider>
  </StrictMode>,
)
