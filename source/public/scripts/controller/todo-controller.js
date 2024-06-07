import { todoService } from "../todoService.js";

// Handlebar compiler
const todoNotesTemplateCompiled = Handlebars.compile(
  document.getElementById("todo-notes-template").innerHTML
);

const editTodoNoteTemplateCompiled = Handlebars.compile(
  document.getElementById("edit-note-template").innerHTML
);



// Targeted containers
const todoNotesContainer = document.getElementById("todo-notes-container");
const editTodoNoteContainer = document.getElementById("edit-todo-note-container");

async function showTodoNotes() {
  const todoNotes = await todoService.getTodoNotes();

  todoNotesContainer.innerHTML = todoNotesTemplateCompiled(
    { displayedTodoNotes: todoNotes },
    { allowProtoPropertiesByDefault: true }
  );
}

async function showEditNote(todoNoteId) {
  let todoNote = null;
  // TODO here comes code for if id is edited
  if (todoNoteId) {
    todoNote = await todoService.findTodo(todoNoteId);
  }


  editTodoNoteContainer.innerHTML = editTodoNoteTemplateCompiled(
    { todoNote },
    { allowProtoPropertiesByDefault: true }
  );
}

async function renderView() {
  await showTodoNotes();
  await showEditNote();
}

function finishedClickEventHandler(event) {
  const todoNoteId = event.target.dataset.todoId;
  if (todoNoteId && event.target.name === 'finished') {
    console.log(todoNoteId);
    event.target.setAttribute("disabled", true);
    todoService.toggleTodoNoteFinished(todoNoteId);
    event.target.removeAttribute("disabled");
  }
}

function editClickEventHandler(event) {
  const todoNoteId = event.target.dataset.todoId;
  if (todoNoteId && event.target.name === 'edit') {
    
    console.log('test edit button');
  }
}

function initEventHandlers() {
  todoNotesContainer.addEventListener("click", finishedClickEventHandler);
  todoNotesContainer.addEventListener("click", editClickEventHandler);
}

// initialize UI
function initialize() {
  initEventHandlers();
  // loadData();
  renderView();
}

initialize();
console.log("start");
