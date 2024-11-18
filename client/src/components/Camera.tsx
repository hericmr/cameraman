import { useEffect, useRef, useState } from "react";

const Camera = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [currentProxyIndex, setCurrentProxyIndex] = useState(0);
  const [detectionsData, setDetectionsData] = useState<{ count: number, labels: string[] }>({
    count: 0,
    labels: [],
  });

  const PROXIES = [
    "https://corsproxy.io/?", 
    "https://api.allorigins.win/raw?url=",
    "https://proxy.cors.sh/",
    "https://yacdn.org/proxy/",
    "https://cors.io/?",
    "https://my-cors-proxy.herokuapp.com/",
    "https://api.cors.bridged.cc/",
    "https://cors-proxy.htmldriven.com/?url=",
    "https://proxy.scrapeops.io/v1/?api_key=YOUR_API_KEY&url=", // ScrapeOps Proxy (requires API key)
    "https://corsnow.com/", // Paid service with a free tier
    "https://www.jayhex.net/cors-proxy.php?url=", // Experimental free proxy
    "https://open-cors-proxy.herokuapp.com/",
  ];
  
  const BASE_IMAGE_URL =
    "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam0451/snap_c1.jpg?";

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/yoloWorker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (event) => {
      const { status, output, error } = event.data;

      if (error) {
        console.error("Worker error:", error);
        return;
      }

      if (status === "complete") {
        const detections = JSON.parse(output);
        console.log("Detections from worker: ", detections);
        drawDetections(detections, 640, 480);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const fetchImageAndProcess = async () => {
    try {
      const proxy = PROXIES[currentProxyIndex];
      const timestamp = new Date().getTime();
      const imageUrlWithProxy = `${proxy}${BASE_IMAGE_URL}?timestamp=${timestamp}`;

      const response = await fetch(imageUrlWithProxy);
      if (!response.ok) {
        throw new Error(`Proxy failed: ${proxy}`);
      }

      const blob = await response.blob();
      const newImageUrl = URL.createObjectURL(blob);

      if (imageRef.current) {
        imageRef.current.src = newImageUrl;
      }

      const imageData = await blob.arrayBuffer();
      workerRef.current?.postMessage({
        imageData: new Uint8Array(imageData),
        confidence: 0.4,
        iouThreshold: 0.5,
      });
    } catch (error) {
      console.error("Failed to fetch image:", error);
      tryNextProxy();
    }
  };

  const tryNextProxy = () => {
    setCurrentProxyIndex((prevIndex) => (prevIndex + 1) % PROXIES.length);
  };

  const drawDetections = (detections: any[], width: number, height: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    let detectedLabels: string[] = [];

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = width;
      canvas.height = height;

      if (imageRef.current) {
        ctx.drawImage(imageRef.current, 0, 0, width, height);

        // Obter as dimensões da imagem original
        const imgWidth = imageRef.current.naturalWidth;
        const imgHeight = imageRef.current.naturalHeight;

        // Calcular o fator de escala para ajustar as coordenadas da detecção
        const scaleX = width / imgWidth;
        const scaleY = height / imgHeight;

        detections.forEach((detection) => {
          const [label, bbox] = detection;
          const { xmin, xmax, ymin, ymax, confidence } = bbox;

          // Ajuste das coordenadas da caixa delimitadora
          const adjustedXmin = xmin * scaleX;
          const adjustedXmax = xmax * scaleX;
          const adjustedYmin = ymin * scaleY;
          const adjustedYmax = ymax * scaleY;

          // Desenhar a caixa delimitadora
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(adjustedXmin, adjustedYmin, adjustedXmax - adjustedXmin, adjustedYmax - adjustedYmin);

          // Texto da classe e confiança
          ctx.fillStyle = "red";
          ctx.font = "16px Arial";
          ctx.fillText(
            `${label} (${(confidence * 100).toFixed(1)}%)`,
            adjustedXmin,
            adjustedYmin - 5
          );

          // Adicionar o rótulo à lista
          if (!detectedLabels.includes(label)) {
            detectedLabels.push(label);
          }
        });

        // Atualizar a contagem e os rótulos detectados
        setDetectionsData({
          count: detections.length,
          labels: detectedLabels,
        });
      }
    }
  };

  useEffect(() => {
    fetchImageAndProcess();

    const interval = setInterval(() => {
      fetchImageAndProcess();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentProxyIndex]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", position: "relative" }}>
      <img
        ref={imageRef}
        alt="Camera"
        style={{
          display: "none",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "640px",
          height: "480px",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "white",
          fontSize: "16px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <p><strong>Objetos Detectados:</strong></p>
        <p>Quantidade: {detectionsData.count}</p>
        <ul>
          {detectionsData.labels.map((label, index) => (
            <li key={index}>{label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Camera;
