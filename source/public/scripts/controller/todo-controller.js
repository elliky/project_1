import {
  FilterAttribute,
  SortAttribute,
  SortOrder,
  filterAttribtes,
  sortAttributes,
} from "../../model/constants.js";
import TodoNote from "../../model/todo-note.js";
import { httpService } from "../http-service.js";
import { todoService } from "../todoService.js";

// State attributes
const stateAttributes = {
  sortAttribute: SortAttribute.Importance,
  sortOrder: SortOrder.Asc,
  filterAttribute: FilterAttribute.None,
};

// Handlebar compiler
const todoNotesTemplateCompiled = Handlebars.compile(
  document.getElementById("todo-notes-template").innerHTML
);

const editTodoNoteTemplateCompiled = Handlebars.compile(
  document.getElementById("edit-note-template").innerHTML
);

Handlebars.registerHelper("hbFormatDate", (str) =>
  luxon.DateTime.fromISO(str).toRelativeCalendar()
);

// Targeted containers
const sortButtonsContainer = document.getElementById("sort-buttons");
const createNewButton = document.querySelector("#create-new");
const toggleStyleButton = document.querySelector("#toggle-style");
const todoNotesContainer = document.getElementById("todo-notes-container");
const editTodoNoteContainer = document.getElementById(
  "edit-todo-note-container"
);

/**
 *
 * @param element selector for document via querySelector
 * @param bool if true hide element, else show element
 */
function hideElement(element, bool) {
  if (bool) {
    document.querySelector(element).classList.add("hidden");
  } else {
    document.querySelector(element).classList.remove("hidden");
  }
}

/**
 *
 * @param bool if true show list-view, else show todoNote create/edit view
 */
function showListView(bool) {
  if (bool) {
    hideElement("#edit-todo-note-container", true);
    hideElement("#todo-notes-container", false);
  } else {
    hideElement("#edit-todo-note-container", false);
    hideElement("#todo-notes-container", true);
  }
}

async function showTodoNotes() {
  const todoNotes = await todoService.getTodoNotes(
    stateAttributes.sortAttribute,
    stateAttributes.sortOrder,
    stateAttributes.filterAttribute
  );

  todoNotesContainer.innerHTML = todoNotesTemplateCompiled(
    { displayedTodoNotes: todoNotes, displayedSortButton: sortAttributes },
    { allowProtoPropertiesByDefault: true }
  );

  showListView(true);
}

async function showEditNote(todoNoteId) {
  let todoNote = null;
  if (todoNoteId) {
    todoNote = await todoService.getTodoNote(todoNoteId);
  }

  console.log("todoNote before loading for edit", todoNote);

  editTodoNoteContainer.innerHTML = editTodoNoteTemplateCompiled(
    { todoNote },
    { allowProtoPropertiesByDefault: true }
  );

  showListView(false);

  // TODO wasn't able yet to add EventListener in initialize because the button's weren't there on document during init time, but should be moved
  document
    .querySelector('button[name="saveTodoNoteOverview"]')
    .addEventListener("click", saveAndOverviewEventHandler);
  document
    .querySelector('button[name="saveTodoNote"]')
    .addEventListener("click", saveEventHandler);
  document
    .querySelector('button[name="overview"]')
    .addEventListener("click", overviewEventHandler);
}

function getTodoNoteFromFormData() {
  const id = document.querySelector('input[name="id"]').value;
  const title = document.querySelector('input[name="title"]').value;
  const importance = document.querySelector('input[name="importance"]').value;
  const dueDate = document.querySelector('input[name="dueDate"]').value;
  const finished = document.querySelector('input[id="finished"]').checked;
  const description = document.querySelector(
    'textarea[name="description"]'
  ).value;

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
  // await showEditNote();
}

async function finishedClickEventHandler(event) {
  const { todoNoteId } = event.target.dataset;
  if (todoNoteId && event.target.name === "finished") {
    event.target.setAttribute("disabled", true);
    todoService.toggleTodoNoteFinished(todoNoteId);
    event.target.removeAttribute("disabled");
  }
}

async function editClickEventHandler(event) {
  const { todoNoteId } = event.target.dataset;
  if (todoNoteId && event.target.name === "edit") {
    showEditNote(todoNoteId);
  }
}

async function createOrUpdateTodoNote() {
  const todoNote = getTodoNoteFromFormData();
  console.log("test todoNote from form", todoNote);
  if (todoNote.id) {
    // update existing todoNote
    return todoService.updateTodoNote(todoNote);
  }

  return todoService.createTodoNote(todoNote);
}

function handleToggleStyle() {
  // TODO implement toggle style
}

async function handleSortButton(event) {
  const { sortAttribute } = event.target.dataset;
  if (sortAttribute) {
    if (sortAttribute === stateAttributes.sortAttribute) {
      stateAttributes.sortOrder =
        stateAttributes.sortOrder === SortOrder.Asc
          ? SortOrder.Desc
          : SortOrder.Asc;
    } else {
      stateAttributes.sortAttribute = sortAttribute;
      stateAttributes.sortOrder = SortOrder.Asc;
    }
    // let sortAttribute = SortAttribute.Importance;
    // let sortOrder = SortOrder.Asc;
    // let filterAttribute = null;
    console.log("sortAttribute", sortAttribute);

    showTodoNotes();
  }
}

async function handleFilterButton(event) {
  const { id } = event.target;
  if (id === "toggleFilter") {
    // TODO maybe we can add something to the button to tell which will be next or which is it right now
    const arrayIndex = filterAttribtes.indexOf(stateAttributes.filterAttribute);
    const nextArrayIndex =
      filterAttribtes.length > arrayIndex + 1 ? arrayIndex + 1 : 0;
    stateAttributes.filterAttribute = filterAttribtes[nextArrayIndex];

    showTodoNotes();
  }
}

async function saveEventHandler() {
  // TODO this fires when form isn't complete => change
  // maybe this helps https://angelogentileiii.medium.com/using-addeventlistener-with-forms-submit-vs-click-event-listener-e07bcf35cadc
  await createOrUpdateTodoNote();
}

async function saveAndOverviewEventHandler() {
  // TODO this fires when form isn't complete => change
  await createOrUpdateTodoNote();
  await showTodoNotes();
}

async function overviewEventHandler() {
  await showTodoNotes();
}

function initEventHandlers() {
  // TODO entscheide welle container
  // sortButtonsContainer.addEventListener('click', handleSortButton);
  createNewButton.addEventListener("click", () => showEditNote());
  toggleStyleButton.addEventListener("click", handleToggleStyle);

  todoNotesContainer.addEventListener("click", handleSortButton);
  todoNotesContainer.addEventListener("click", handleFilterButton);
  todoNotesContainer.addEventListener("click", finishedClickEventHandler);
  todoNotesContainer.addEventListener("click", editClickEventHandler);

  // TODO wird glaub nüm brucht
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
