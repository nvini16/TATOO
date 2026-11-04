import { StrictMode, useCallback, useEffect, useState } from 'react'
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
import LoadingScreen from './components/LoadingScreen.jsx'
import bodyBackground from './assets/body.webp.jpeg'

function Root() {
  const [showLoading, setShowLoading] = useState(true)
  const [animationFinished, setAnimationFinished] = useState(false)
  const [resourcesReady, setResourcesReady] = useState(false)

  const handleAnimationComplete = useCallback(() => {
    setAnimationFinished(true)
  }, [])

  const handleLoadingExit = useCallback(() => {
    setShowLoading(false)
  }, [])

  useEffect(() => {
    // Remove the static black fallback only after React has mounted its loader.
    document.getElementById('initial-loader')?.remove()

    let cancelled = false
    const background = new Image()

    const backgroundReady = new Promise((resolve) => {
      background.onload = resolve
      background.onerror = resolve
      background.src = bodyBackground
      if (background.complete) resolve()
    })

    const fontsReady = document.fonts?.ready ?? Promise.resolve()

    Promise.race([
      Promise.all([backgroundReady, fontsReady]),
      new Promise((resolve) => window.setTimeout(resolve, 3000)),
    ]).then(() => {
      if (!cancelled) setResourcesReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const shouldExitLoading = animationFinished && resourcesReady

  return (
    <StrictMode>
      <App />
      {showLoading && (
        <LoadingScreen
          shouldExit={shouldExitLoading}
          onAnimationComplete={handleAnimationComplete}
          onExit={handleLoadingExit}
        />
      )}
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
