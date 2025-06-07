import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import { CoffeCrm } from './CoffeCrm'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
<CoffeCrm></CoffeCrm>
  </StrictMode>,
)
