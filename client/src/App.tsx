import { useState, useCallback } from "react"
import Webcam from "react-webcam"
import { YOLOWorker } from "./workers/yoloWorker"

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [confidence, setConfidence] = useState(0.5)
  const [worker] = useState(() => new YOLOWorker())

  const videoRef = useCallback((node: Webcam) => {
    if (node) {
      worker.setVideo(node.video)
    }
  }, [worker])

  const toggleDetection = () => {
    if (isRunning) {
      worker.stop()
    } else {
      worker.start()
    }
    setIsRunning(!isRunning)
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-dark-primary mb-2">Cameraman</h1>
          <p className="text-gray-400">Detecção de objetos em tempo real usando YOLOv8</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="relative aspect-video mb-4">
              <Webcam
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                width={640}
                height={480}
              />
              <div className="absolute bottom-4 left-4 right-4 flex gap-4">
                <button
                  onClick={toggleDetection}
                  className={`btn flex-1 ${
                    isRunning ? "btn-secondary" : "btn-primary"
                  }`}
                >
                  {isRunning ? "Pausar" : "Iniciar"}
                </button>
              </div>
            </div>
          </div>

          <div className="card space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Configurações</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confiança da Detecção
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={confidence}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      setConfidence(value)
                      worker.setConfidence(value)
                    }}
                    className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-gray-400 mt-1">
                    {Math.round(confidence * 100)}%
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Sobre</h2>
              <p className="text-gray-400">
                Este projeto utiliza YOLOv8 para detectar objetos em tempo real diretamente no navegador.
                A detecção é processada localmente usando WebAssembly, garantindo privacidade e performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
