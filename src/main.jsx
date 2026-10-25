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
import './styles/Cuidados.css'
import './styles/footer.css'
import './styles/CalendarioAgendamento.css'
import './styles/alert.css'
import './styles/loginAdmin.css'
import './styles/insights.css'
import './styles/adminMenu.css'
import './styles/adminLayout.css';
import './styles/adminAgendamentos.css'
import './styles/clientesAdmin.css'
import './styles/clientePerfil.css'
import './styles/clienteReferencias.css'
import './styles/clienteHistorico.css'
import './styles/redefinirSenha.css'

import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
