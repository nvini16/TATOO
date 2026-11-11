import { StrictMode, useCallback, useEffect, useState } from 'react'
import App from './App.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import bodyBackground from './assets/body.webp.jpeg'

export default function Root() {
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
