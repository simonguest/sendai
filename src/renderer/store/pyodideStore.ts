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
  executionStatus: "idle" as ExecutionStatus,
  workerStatus: "initializing" as WorkerStatus,
  runningCellId: null as string | null,
  setWorkerStatus(status: WorkerStatus) {
    this.workerStatus = status;
  },
  executeCell(cellId: string) {
    if (this.executionStatus === "idle" && this.workerStatus === "ready") {
      this.runningCellId = cellId;
      this.executionStatus = "queued";
    }
  },
  executionCompleted() {
    this.runningCellId = null;
    this.executionStatus = "idle";
  }
})
