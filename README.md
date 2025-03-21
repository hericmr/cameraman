# Detecção de Objetos em Tempo Real

Este projeto demonstra a detecção de objetos em tempo real diretamente no navegador usando YOLOv8 e WebAssembly (WASM). A interface foi desenvolvida com React.js e integra-se com a webcam para capturar e processar frames de vídeo, enquanto a detecção de objetos é realizada por um módulo Rust compilado em WebAssembly.

A vantagem desta configuração é que toda a detecção de objetos acontece localmente no navegador, sem necessidade de um servidor backend, resultando em melhor performance e privacidade do usuário.

## Características

- Detecção de objetos em tempo real usando YOLOv8
- Interface moderna e responsiva
- Controles de confiança ajustáveis
- Cores diferentes para diferentes tipos de objetos
- Botão de pausar/iniciar para controle do processamento
- Processamento totalmente local no navegador

## Tecnologias Utilizadas

- **React (Cliente)** - para captura de frames de vídeo e exibição dos resultados
- **Rust (WASM)** - para detecção de objetos em tempo real usando WASM e modelo YOLOv8
- **Candle ML** - framework minimalista de machine learning em Rust
- **YOLOv8** - modelo de detecção de objetos state-of-the-art

## Executando Localmente

### Pré-requisitos

- [Node.js & npm](https://nodejs.org/en/download/package-manager) - para o cliente React
- [Rust](https://www.rust-lang.org/tools/install) - para o módulo WebAssembly

### Passos

1. Clone o repositório
   ```bash
   git clone https://github.com/hericmr/react-rust-wasm-yolo-object-detection
   cd react-rust-wasm-yolo-object-detection
   ```
   
2. Instale as dependências do cliente
   ```bash
   cd client
   npm install
   ```

3. Execute o cliente React
   ```bash
   npm run dev
   ```

   O cliente estará rodando em `http://localhost:5173/`

4. Se você quiser recompilar o módulo WASM
   ```bash
   cd yolo_wasm
   make build
   ```
   O módulo compilado será colocado em `client/src/model`

## Controles

- Use o botão "Pausar/Iniciar" para controlar o processamento
- Ajuste o controle deslizante de confiança para controlar a sensibilidade da detecção
- Diferentes objetos são destacados com cores diferentes para melhor visualização

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

- **HericMR** - [GitHub](https://github.com/hericmr)
