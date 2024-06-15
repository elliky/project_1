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

class TodoNoteController {
  static getTodoNotes = async (req, res) => {
    const sortAttribute = req.query.sortAttribute
      ? req.query.sortAttribute
      : SortAttribute.Importance;
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : SortOrder.Asc;
    const filterAttribute = req.query.filterAttribute
      ? req.query.filterAttribute
      : null;

    res.json(
      (await todoNoteStore.all())
        .filter((todo) => filterTodoNote(todo, filterAttribute))
        .sort((s1, s2) => compareAttribute(s1, s2, sortAttribute, sortOrder))
    );
  };

  static updateTodoNote = async (req, res) => {
    res.json(await todoNoteStore.update(req.body.todo));
  };

  static createTodoNote = async (req, res) => {
    res.json(await todoNoteStore.add(req.body.todo));
  };

  static getTodoNote = async (req, res) => {
    res.json(await todoNoteStore.get(req.params.id));
  };
}

export default TodoNoteController;
