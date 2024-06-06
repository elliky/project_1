const DELAY_MS = 200;

function testUUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getRandomUUID() {
  let id;
  if (crypto && crypto.randomUUID === 'function') {
    id = crypto.randomUUID;
  } else {
    id = testUUID();
  }
  return id;
}

class TodoNote {
    constructor(title, importance, dueDate, description, finished, id) {
        this.title = title;
        this.importance = importance;
        this.dueDate = dueDate;
        this.description = description
        this.finished = finished;
        this.id = id;
    }
}

const SortAttribute = {
  Name: 'Name',
  DueDate: 'DueDate',
  Description: 'Description',
  Importance: 'Importance',
}

const SortOrder = {
  Asc: 'Asc',
  Desc: 'Desc'
}

const FilterAttribute = {
  Finished: 'Finished',
  Unfinished: 'Unfinished',
}

let todos = [
    new TodoNote('testNote', 5, new Date(2024, 4, 20), "my first Testnote", false),
    new TodoNote('testNote1', 1, new Date(2024, 4, 25), "my second Testnote", true),
    new TodoNote('testNote2', 3, new Date(2024, 4, 27), "my third Testnote", false),
];



/**
 * Array functions
 */

function compareAttribute(s1, s2, attribute, sortOrder) {
  const order = sortOrder === SortOrder.Asc ? 1 : -1;
  return s2[attribute.toLowerCase()] < s1[attribute.toLowerCase()] ? -1*order : 1*order;
}

function filterTodoNote(todo, filterAttribute) {
  if (filterAttribute === FilterAttribute.Finished || filterAttribute === FilterAttribute.Unfinished) {
    const finished = filterAttribute === FilterAttribute.Finished
    return todo.finished === finished;
  }
  return true;
}


/**
 * TodoNote Services
 * 
 */

async function findTodo(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(todos.find((todo) => id === todo.id));
    }, DELAY_MS);
  });
}


async function toggleTodoNoteFinished(todoNoteId) {
  const todo = await findTodo(todoNoteId);
  console.log(todo);
  if (todo) {
    todo.finished = !todo.finished;
  }
}

async function updateTodoNote(todoNoteId, todoNote) {
  let todo = findTodo(todoNoteId);
  if (todo) {
    todo = todoNote;
  }
}

async function getTodoNotes(sortAttribute = SortAttribute.Importance, sortOrder = SortOrder.Asc, filterAttribute = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...todos].filter((todo) => filterTodoNote(todo, filterAttribute)).sort((s1, s2) => compareAttribute(s1, s2, sortAttribute, sortOrder)));
    }, DELAY_MS);
  });
}

function getTodoNotesSimple(sortAttribute = SortAttribute.Importance, sortOrder = SortOrder.Asc, filterAttribute = null) {
    return ([...todos].filter((todo) => filterTodoNote(todo, filterAttribute)).sort((s1, s2) => compareAttribute(s1, s2, sortAttribute, sortOrder)));
}


async function addTodoNote(todoNote) {
  todos = [...todos, todoNote];
}



export default {toggleTodoNoteFinished, getTodoNotes, getTodoNotesSimple, findTodo, updateTodoNote, addTodoNote, SortAttribute, SortOrder, FilterAttribute};
