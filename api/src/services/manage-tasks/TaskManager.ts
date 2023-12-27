import { ChildProcess, fork } from "child_process";
import { join } from "path";

export interface Task {
  taskType: string;
  callbackUrl: string;
  s3Key?: string;
  topicId?: string;
  resultId?: string;
  priority: boolean;
}

export class TaskManager {
  private maxConcurrency: number;
  private tasks: Task[];

  private static instance: TaskManager;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
    this.tasks = [];
  }

  private spawnTask(task: Task): ChildProcess {
    const childProcess = fork(join(__dirname, "taskHandler.ts"), [
      "-r",
      "ts-node/register",
    ]);

    childProcess.send(task);

    return childProcess;
  }

  private removeTask(task: Task): void {
    this.tasks = this.tasks.filter((t) => t !== task);
  }

  private startNextTask(): void {
    if (this.tasks.length < this.maxConcurrency) {
      // Find the next task to start
      const nextTask = this.tasks[0];

      if (nextTask) {
        const newTaskProcess = this.spawnTask(nextTask);

        newTaskProcess.on("close", () => {
          this.removeTask(nextTask);
          this.startNextTask();
        });
      }
    }
  }

  public static getInstance(): TaskManager {
    return TaskManager.instance;
  }

  public processEvent(newTask: Task) {
    this.tasks.push(newTask);

    if (this.tasks.length < this.maxConcurrency || newTask.priority) {
      const newTaskProcess = this.spawnTask(newTask);

      newTaskProcess.on("close", () => {
        this.removeTask(newTask);
        this.startNextTask();
      });
    }
  }

  public static setup(maxConcurrency: number) {
    TaskManager.instance = new TaskManager(maxConcurrency);
  }
}
