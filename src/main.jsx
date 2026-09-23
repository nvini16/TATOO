import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/header.css'
import './styles/hero.css'
import './styles/agendamento.css'
import './styles/animations.css'
import './styles/cadastro.css'
import './styles/login.css'
import './styles/responsive.css'
import './styles/sobre.css'
import './styles/trabalhos.css'
import './styles/IndexadorImagens.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
