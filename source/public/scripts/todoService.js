import { httpService } from "./http-service.js";

class TodoService {
  constructor(service) {
    this.httpService = service;
  }

  async createTodoNote(todo) {
    return this.httpService.ajax("POST", "/todoNotes/", { todo });
  }

  async updateTodoNote(todo) {
    return this.httpService.ajax("PUT", "/todoNotes/", { todo });
  }

  async getTodoNotes(sortAttribute, sortOrder, filterAttribute) {
    let filterParameter = '';
    if (filterAttribute) {
      filterParameter = `&filterAttribute=${filterAttribute}`
    }
    return this.httpService.ajax("GET", `/todoNotes/?sortAttribute=${sortAttribute}&sortOrder=${sortOrder}${filterParameter}`);
  }

  async getTodoNote(id) {
    return this.httpService.ajax("GET", `/todoNotes/${id}`);
  }

  async toggleTodoNoteFinished(todoNoteId) {
    const todo = await this.getTodoNote(todoNoteId);
    console.log(todo);
    if (todo) {
      console.log(todo.finished);
      todo.finished = !todo.finished;
    }
    return this.updateTodoNote(todo)
  }
}

export const todoService = new TodoService(httpService);
