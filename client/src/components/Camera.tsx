import { useEffect, useRef, useCallback, useState } from "react"
import Webcam from "react-webcam"

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "environment",
}

const Camera = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const [isRunning, setIsRunning] = useState(true)
  const [confidence, setConfidence] = useState(0.5)

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/yoloWorker.js", import.meta.url), {
      type: "module",
    })

    workerRef.current.onmessage = (event) => {
      const { status, output, error } = event.data

      if (error) {
        console.error("Worker error:", error)
        return
      }

      if (status === "complete") {
        const detections = JSON.parse(output)
        drawDetections(detections, 640, 480)
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const base64ToUint8Array = (base64: string) => {
    const binaryString = window.atob(base64.split(",")[1])
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  const drawDetections = (detections: any[], width: number, height: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      canvas.width = width
      canvas.height = height

      detections.forEach((detection) => {
        const [label, bbox] = detection
        const { xmin, xmax, ymin, ymax, confidence } = bbox

        // Cores personalizadas para diferentes classes
        const colors = {
          person: "#FF0000",
          car: "#00FF00",
          dog: "#0000FF",
          cat: "#FFFF00",
          default: "#FF00FF"
        }

        const color = colors[label as keyof typeof colors] || colors.default
        ctx.strokeStyle = color
        ctx.lineWidth = 2

        ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin)

        ctx.fillStyle = color
        ctx.font = "bold 16px Arial"
        ctx.fillText(`${label} (${(confidence * 100).toFixed(1)}%)`, xmin, ymin - 5)

        if (bbox.keypoints && bbox.keypoints.length > 0) {
          ctx.fillStyle = "#00FFFF"
          bbox.keypoints.forEach((keypoint: any) => {
            const { x, y } = keypoint
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, 2 * Math.PI)
            ctx.fill()
          })
        }
      })
    }
  }

  const processFrameWithWorker = useCallback(() => {
    if (webcamRef.current && workerRef.current && isRunning) {
      const imageSrc = webcamRef.current.getScreenshot({ width: 640, height: 480 })

      if (imageSrc) {
        const imageData = base64ToUint8Array(imageSrc)

        workerRef.current.postMessage({
          imageData,
          confidence: confidence,
          iouThreshold: 0.5,
        })
      }
    }
  }, [isRunning, confidence])

  useEffect(() => {
    const interval = setInterval(() => {
      processFrameWithWorker()
    }, 1000)
    return () => clearInterval(interval)
  }, [processFrameWithWorker])

  return (
    <div style={{ position: "relative", width: "640px", margin: "0 auto" }}>
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      
      <div style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        marginTop: "10px"
      }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            padding: "8px 16px",
            backgroundColor: isRunning ? "#ff4444" : "#44ff44",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {isRunning ? "Pausar" : "Iniciar"}
        </button>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label htmlFor="confidence">Confiança:</label>
          <input
            type="range"
            id="confidence"
            min="0.1"
            max="1"
            step="0.1"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
          />
          <span>{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  )
}

export default Camera
