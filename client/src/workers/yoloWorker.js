import init, { Model } from "../model/m.js"

class YoloWorker {
  static instance = null

  static async getInstance() {
    if (!this.instance) {
      await init()
      console.log("Wasm module initialized in worker")

      this.instance = new Model()
      console.log("YOLO model initialized in worker")
    }
    return this.instance
  }
}

self.addEventListener("message", async (event) => {
  const { imageData, confidence, iouThreshold } = event.data

  try {
    self.postMessage({ status: "running inference" })

    const model = await YoloWorker.getInstance()

    const bboxes = await model.run(imageData, confidence, iouThreshold)

    self.postMessage({
      status: "complete",
      output: bboxes,
    })
  } catch (error) {
    self.postMessage({ error: error.message })
  }
})
