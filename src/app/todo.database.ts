import Dexie from 'dexie';
import { Todo, TodoSummary } from './models.interface';

export class TodoDatabase extends Dexie {
  //declare collection ref => Table<data type, pkey type)
  private todo: Dexie.Table<Todo, string>;

  constructor() {
    //define db name
    super('tododb');

    //setup schema for v1 and create collection todo with primary key of id
    this.version(1).stores({
      todo: 'id',
    });

    //get ref to the collection
    this.todo = this.table('todo');
  }

  async addTodo(t: Todo): Promise<any> {
    return await this.todo.put(t);
  }

  async deleteTodo(t: Todo): Promise<any> {
    return await this.todo.delete(t.id);
  }

  async getTodoSummary(): Promise<TodoSummary[]> {
    return (await this.todo.toArray()).map((d) => {
      return {
        id: d.id,
        title: d.title,
      } as TodoSummary;
    });
  }

  async getTodo(id: string): Promise<Todo> {
    return (await this.todo.get(id)) as Todo;
  }
}
