import "./App.css";
import Camera from "./components/Camera.tsx";

function App() {
  return (
    <>
      <header style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        marginBottom: "20px"
      }}>
        <h1>HericMR - Detecção de Objetos em Tempo Real</h1>
        <p>Usando YOLOv8 e WebAssembly para detecção de objetos em tempo real</p>
      </header>
      
      <Camera />
      
      <footer
        style={{
          textAlign: "center",
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
        }}
      >
        <p>Desenvolvido por HericMR</p>
        <p>
          <a href="https://github.com/hericmr" target="_blank" style={{ color: "#ffffff" }}>
            GitHub
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
