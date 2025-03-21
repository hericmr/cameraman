export class YOLOWorker {
  constructor();
  setVideo(video: HTMLVideoElement): void;
  start(): void;
  stop(): void;
  setConfidence(value: number): void;
} 