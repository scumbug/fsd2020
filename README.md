# Todo App Structure

### Components involved

| Page        | Component        |
| ----------- | ---------------- |
| Main Page   | todo.component   |
| Create Todo | create.component |
| Edit Todo   | edit.component   |
| Form        | form.component   |

### Models

- Todo
  - id (number)
  - title (string)
  - tasks (Task[])
- Task
  - description (String)
  - priority (Priority)
- Priority
  - Low
  - Medium
  - High
