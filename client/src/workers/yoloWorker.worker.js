import init, { Model } from "../model/m.js"

let model = null;

async function initModel() {
  if (!model) {
    await init();
    model = new Model();
  }
  return model;
}

self.addEventListener("message", async (event) => {
  const { imageData, confidence, iouThreshold } = event.data;

  try {
    self.postMessage({ status: "running inference" });
    const model = await initModel();
    const bboxes = await model.run(imageData, confidence, iouThreshold);

    self.postMessage({
      status: "complete",
      output: bboxes,
    });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
}); 