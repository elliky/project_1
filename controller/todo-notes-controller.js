import { todoNoteStore } from "../services/todo-note-store.js";
import {
  SortAttribute,
  SortOrder,
  FilterAttribute,
} from "../source/public/model/constants.js";

function lowerCaseFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}


/**
 * Array functions
 */

function compareAttribute(s1, s2, attribute, sortOrder) {
  const order = sortOrder === SortOrder.Asc ? 1 : -1;
  const attributeKey = lowerCaseFirstLetter(attribute);
  return s2[attributeKey] < s1[attributeKey]
    ? -1 * order
    : 1 * order;
}

function filterTodoNote(todo, filterAttribute) {
  if (
    filterAttribute === FilterAttribute.Finished ||
    filterAttribute === FilterAttribute.Unfinished
  ) {
    const finished = filterAttribute === FilterAttribute.Finished;
    return todo.finished === finished;
  }
  return true;
}

export class TodoNoteController {
  getTodoNotes = async (req, res) => {
    let sortAttribute = req.query.sortAttribute
      ? req.query.sortAttribute
      : SortAttribute.Importance;
    let sortOrder = req.query.sortOrder ? req.query.sortOrder : SortOrder.Asc;
    let filterAttribute = req.query.filterAttribute
      ? req.query.filterAttribute
      : null;

    res.json(
      (await todoNoteStore.all())
        .filter((todo) => filterTodoNote(todo, filterAttribute))
        .sort((s1, s2) => compareAttribute(s1, s2, sortAttribute, sortOrder))
    );
  };

  updateTodoNote = async (req, res) => {
    res.json(await todoNoteStore.update(req.body.todo));
  };

  createTodoNote = async (req, res) => {
    res.json(await todoNoteStore.add(req.body.todo));
  };

  getTodoNote = async (req, res) => {
    console.log(req.params.id);
    console.log(await todoNoteStore.get(req.params.id));
    res.json(await todoNoteStore.get(req.params.id));
  };
}

export const todoNoteController = new TodoNoteController();
