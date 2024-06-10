import TodoNote from "../../model/todo-note.js";
import { httpService } from "../http-service.js";
import { todoService } from "../todoService.js";

// Handlebar compiler
const todoNotesTemplateCompiled = Handlebars.compile(
  document.getElementById("todo-notes-template").innerHTML
);

const editTodoNoteTemplateCompiled = Handlebars.compile(
  document.getElementById("edit-note-template").innerHTML
);

Handlebars.registerHelper("hbFormatDate", str => luxon.DateTime.fromISO(str).toRelativeCalendar());

let selectedTodoNote = null;

// Targeted containers
const todoNotesContainer = document.getElementById("todo-notes-container");
const editTodoNoteContainer = document.getElementById(
  "edit-todo-note-container"
);

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
    todoNote = await todoService.getTodoNote(todoNoteId);
    // todoNote.dueDate = Date.parse(todoNote.dueDate);
  }

  console.log('todoNote before loading for edit', todoNote);

  editTodoNoteContainer.innerHTML = editTodoNoteTemplateCompiled(
    { todoNote },
    { allowProtoPropertiesByDefault: true }
  );

  // TODO wasn't able yet to add EventListener in initialize because the button's weren't there on document during init time, but should be moved
  document
    .querySelector('button[name="saveTodoNoteOverview"]')
    .addEventListener("click", saveAndOverviewEventHandler);
  document
    .querySelector('button[name="saveTodoNote"]')
    .addEventListener("click", saveEventHandler);
}

function getTodoNoteFromFormData() {
  const id = document.querySelector('input[name="id"]').value;
  const title = document.querySelector('input[name="title"]').value;
  const importance = +document.querySelector('input[name="importance"]').value;
  const dueDate = document.querySelector('input[name="dueDate"]').value;
  const finished = document.querySelector('input[id="finished"]').checked;
  const description = document.querySelector(
    'textarea[name="description"]'
  ).value;
  console.log('titel', title);

  return new TodoNote(
    title,
    importance,
    dueDate,
    description,
    finished,
    id || null
  );
}

async function renderView() {
  await showTodoNotes();
  await showEditNote();
}

async function finishedClickEventHandler(event) {
  const todoNoteId = event.target.dataset.todoId;
  if (todoNoteId && event.target.name === "finished") {
    event.target.setAttribute("disabled", true);
    todoService.toggleTodoNoteFinished(todoNoteId);
    event.target.removeAttribute("disabled");
  }
}

async function editClickEventHandler(event) {
  const todoNoteId = event.target.dataset.todoId;
  if (todoNoteId && event.target.name === "edit") {
    showEditNote(todoNoteId);
  }
}

async function createOrUpdateTodoNote() {
  const todoNote = getTodoNoteFromFormData();
  console.log('test todoNote from form', todoNote);
  if (todoNote.id) {
    // update existing todoNote
    return todoService.updateTodoNote(todoNote);
  }

  return todoService.createTodoNote(todoNote);
}

async function saveEventHandler(event) {
  await createOrUpdateTodoNote();
}

async function saveAndOverviewEventHandler(event) {
  await createOrUpdateTodoNote();
}

function initEventHandlers() {
  todoNotesContainer.addEventListener("click", finishedClickEventHandler);
  todoNotesContainer.addEventListener("click", editClickEventHandler);
  // document.querySelector('button[name="saveTodoNoteOverview"]').addEventListener('click', saveAndOverviewEventHandler)
  // document.querySelector('button[name="saveTodoNote"]').addEventListener('click', saveEventHandler)
}

// initialize UI
function initialize() {
  // loadData();
  renderView();
  initEventHandlers();
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("start");
  initialize();
});

// initialize();
