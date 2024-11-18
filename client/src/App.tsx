import "./App.css";
import Camera from "./components/Camera";

function App() {
  return (
    <div id="root">
      <main>
        <Camera />
      </main>
      <footer>
        <p>
          Câmeras de Santos, desenvolvido por{" "}
          <a href="https://github.io/hericmr" target="_blank">
            <img
              src="https://img.icons8.com/material-rounded/16/61dafb/person-male.png"
              alt="Autor"
            />
            Héric Moura
          </a>
        </p>
        <p>
          Veja o código fonte em{" "}
          <a href="https://github.com/hericmr/cameras" target="_blank">
            <img
              src="https://img.icons8.com/material-outlined/16/61dafb/github.png"
              alt="GitHub"
            />
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
