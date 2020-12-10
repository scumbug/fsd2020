export interface Task {
  description: string;
  priority: Priority;
  image: string;
}

export interface Todo {
  id: string;
  title: string;
  tasks: Task[];
}

export enum Priority {
  Low = 0,
  Medium,
  High,
}
