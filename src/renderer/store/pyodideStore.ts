import { reactive } from 'vue'

export type ExecutionStatus = "idle" | "queued" | "running";
export type InputStatus = "idle" | "waiting" | "submitted";
export type WorkerStatus =
  | "initializing"
  | "ready"
  | "error"
  | "interrupted"
  | "terminating";

export const pyodideStore = reactive({
  workerStatus: "initializing" as WorkerStatus,
  setWorkerStatus(status: WorkerStatus) {
    this.workerStatus = status;
  }
})
