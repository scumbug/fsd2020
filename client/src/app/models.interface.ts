export interface Task {
  id?: number;
  description: string;
  priority: Priority;
  image: string;
}

export interface Todo {
  id: number;
  title: string;
  image: string;
  tasks?: Task[];
}

export enum Priority {
  Low = 0,
  Medium,
  High,
}
