import TodoNote from "../model/todo-note.js";
import { httpService } from "./http-service.js";

const DELAY_MS = 200;

function testUUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getRandomUUID() {
  let id;
  if (crypto && crypto.randomUUID === "function") {
    id = crypto.randomUUID;
  } else {
    id = testUUID();
  }
  return id;
}

const SortAttribute = {
  Name: "Name",
  DueDate: "DueDate",
  Description: "Description",
  Importance: "Importance",
};

const SortOrder = {
  Asc: "Asc",
  Desc: "Desc",
};

const FilterAttribute = {
  Finished: "Finished",
  Unfinished: "Unfinished",
};

let todos = [
  new TodoNote(
    "testNote",
    5,
    new Date(2024, 4, 20),
    "my first Testnote",
    false
  ),
  new TodoNote(
    "testNote1",
    1,
    new Date(2024, 4, 25),
    "my second Testnote",
    true
  ),
  new TodoNote(
    "testNote2",
    3,
    new Date(2024, 4, 27),
    "my third Testnote",
    false
  ),
];

class TodoService {
  async createTodoNote(todo) {
    return httpService.ajax("POST", "/todoNotes/", { todo });
  }

  async updateTodoNote(todo) {
    return httpService.ajax("PUT", "/todoNotes/", { todo });
  }

  async getTodoNotes() {
    return httpService.ajax("GET", "/todoNotes/");
  }

  async getTodoNote(id) {
    return httpService.ajax("GET", `/todoNotes/${id}`);
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

// export default {todoService, SortAttribute, SortOrder, FilterAttribute};
export const todoService = new TodoService();
