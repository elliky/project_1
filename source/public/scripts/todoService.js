import HttpService from "./http-service.js";

class TodoService {
  static async createTodoNote(todo) {
    return HttpService.ajax("POST", "/todoNotes/", { todo });
  }

  static async updateTodoNote(todo) {
    return HttpService.ajax("PUT", "/todoNotes/", { todo });
  }

  static async getTodoNotes(sortAttribute, sortOrder, filterAttribute) {
    let filterParameter = '';
    if (filterAttribute) {
      filterParameter = `&filterAttribute=${filterAttribute}`
    }
    return HttpService.ajax("GET", `/todoNotes/?sortAttribute=${sortAttribute}&sortOrder=${sortOrder}${filterParameter}`);
  }

  static async getTodoNote(id) {
    return HttpService.ajax("GET", `/todoNotes/${id}`);
  }

  /**
   * This function was used to make it easier but isn't the best way to handle it in general,
   * because the shown data in frontend could be old, so it would't behave as expected by the user
   *
   * @param todoNoteId id of todoNote
   * @returns new todoNote with toggled finished attribute
   */
  static async toggleTodoNoteFinished(todoNoteId) {
    const todo = await this.getTodoNote(todoNoteId);
    if (todo) {
      todo.finished = !todo.finished;
    }
    return this.updateTodoNote(todo)
  }
}

export default TodoService;
