import init, { Model } from "../model/m.js"

export class YOLOWorker {
  constructor() {
    this.video = null;
    this.isRunning = false;
    this.confidence = 0.5;
    this.worker = new Worker(new URL('./yoloWorker.worker.js', import.meta.url));
  }

  setVideo(video) {
    this.video = video;
  }

  start() {
    if (!this.video) return;
    this.isRunning = true;
    this.run();
  }

  stop() {
    this.isRunning = false;
  }

  setConfidence(value) {
    this.confidence = value;
  }

  async run() {
    if (!this.isRunning) return;

    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.worker.postMessage({
      imageData,
      confidence: this.confidence,
      iouThreshold: 0.45
    });

    this.worker.onmessage = (event) => {
      if (event.data.status === 'complete') {
        const bboxes = event.data.output;
        this.drawBoundingBoxes(ctx, bboxes);
      }
    };

    requestAnimationFrame(() => this.run());
  }

  drawBoundingBoxes(ctx, bboxes) {
    bboxes.forEach(bbox => {
      const [x, y, width, height, confidence, classId] = bbox;
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
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
