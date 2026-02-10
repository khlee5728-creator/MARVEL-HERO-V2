import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initScaling } from './utils/scaling.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

initScaling({
  designWidth: 1280,
  designHeight: 800,
  containerId: 'app',
})
