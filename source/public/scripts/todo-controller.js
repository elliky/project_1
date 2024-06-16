// didn't know how to include Handlebars and luxon in here without getting an error and without changing to npm package instead of script include in the html
/* eslint-disable no-undef */

import {
  FilterAttribute,
  SortAttribute,
  SortOrder,
  filterAttribtes,
  sortAttributes,
} from "../model/constants.js";
import TodoNote from "../model/todo-note.js";

import TodoService from "./todoService.js";

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

Handlebars.registerHelper("hbFormatDate", (dueDate) =>
  // luxon.Interval.fromDateTimes(luxon.DateTime.fromISO(str), luxon.DateTime.now()).length('days')
  luxon.DateTime.fromISO(dueDate).toRelativeCalendar()
);

function getDueDateStyleFromDateTimes(dueDate) {
  const dateTimeDueDate = luxon.DateTime.fromISO(dueDate);
  const dateTimeNow = luxon.DateTime.now();
  let diff = luxon.Interval.fromDateTimes(dateTimeDueDate, dateTimeNow).length('days')
  // if luxon gives back NaN it's negative => the dueDate is in the future
  if (Number.isNaN(diff)) {
    diff = luxon.Interval.fromDateTimes(dateTimeNow, dateTimeDueDate).length('days')
    if (diff <= 5) {
      return 'list-due-date-soon';
    }
    return 'list-due-date-sufficient';
  }
  if (diff < 1) {
    return 'list-due-date-today';
  }
  return 'list-due-date-missed';
}

Handlebars.registerHelper("hbDueDateStyle", (dueDate) =>
  getDueDateStyleFromDateTimes(dueDate)
);

// Targeted containers
const createNewButton = document.querySelector("#create-new");
const toggleStyleButton = document.querySelector("#toggle-style");
const todoNotesContainer = document.querySelector("#todo-notes-container");
const editTodoNoteContainer = document.querySelector(
  "#edit-todo-note-container"
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
  const todoNotes = await TodoService.getTodoNotes(
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
    todoNote = await TodoService.getTodoNote(todoNoteId);
  }

  editTodoNoteContainer.innerHTML = editTodoNoteTemplateCompiled(
    { todoNote },
    { allowProtoPropertiesByDefault: true }
  );

  showListView(false);
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
    await TodoService.toggleTodoNoteFinished(todoNoteId);
    event.target.removeAttribute("disabled");
  }

  // refresh the todoNote list in case there is a filter applied
  showTodoNotes();
}

async function editClickEventHandler(event) {
  const { todoNoteId } = event.target.dataset;
  if (todoNoteId && event.target.name === "edit") {
    showEditNote(todoNoteId);
  }
}

function validateTodoNoteInput(todoNote) {
  if (
    todoNote.title &&
    todoNote.importance &&
    todoNote.dueDate &&
    luxon.DateTime.fromISO(todoNote.dueDate).isValid
  ) {
    return true;
  }
  return false;
}

async function createOrUpdateTodoNote() {
  const todoNote = getTodoNoteFromFormData();

  if (!validateTodoNoteInput(todoNote)) {
    return undefined;
  }

  if (todoNote.id) {
    // update existing todoNote
    return TodoService.updateTodoNote(todoNote);
  }

  return TodoService.createTodoNote(todoNote);
}

function handleToggleStyle() {
  document.body.classList.toggle("dark-mode");
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

    showTodoNotes();
  }
}

async function handleFilterButton(event) {
  const { id } = event.target;
  if (id === "toggleFilter") {
    const arrayIndex = filterAttribtes.indexOf(stateAttributes.filterAttribute);
    const nextArrayIndex =
      filterAttribtes.length > arrayIndex + 1 ? arrayIndex + 1 : 0;
    stateAttributes.filterAttribute = filterAttribtes[nextArrayIndex];

    showTodoNotes();
  }
}

async function saveEventHandler(event) {
  if (event.target.id !== "saveTodoNote") {
    return;
  }

  // TODO this fires when form isn't complete => change
  // maybe this helps https://angelogentileiii.medium.com/using-addeventlistener-with-forms-submit-vs-click-event-listener-e07bcf35cadc
  const todoNote = await createOrUpdateTodoNote();

  // only rerender on valid result
  if (todoNote) {
    // especially for new notes (to use the newly generated id) but also for cases where the backend wouldn't accept some changes we render the todoNote given from backend again
    await showEditNote(todoNote.id);
  }
}

async function saveAndOverviewEventHandler(event) {
  if (event.target.id !== "saveTodoNoteOverview") {
    return;
  }

  // don't change view if update wasn't succesful or form data wasn't valid
  if (await createOrUpdateTodoNote()) {
    await showTodoNotes();
  }
}

async function overviewEventHandler(event) {
  if (event.target.id !== "overview") {
    return;
  }

  await showTodoNotes();
}

function initEventHandlers() {
  createNewButton.addEventListener("click", () => showEditNote());
  toggleStyleButton.addEventListener("click", handleToggleStyle);

  todoNotesContainer.addEventListener("click", handleSortButton);
  todoNotesContainer.addEventListener("click", handleFilterButton);
  todoNotesContainer.addEventListener("click", finishedClickEventHandler);
  todoNotesContainer.addEventListener("click", editClickEventHandler);

  editTodoNoteContainer.addEventListener("click", saveAndOverviewEventHandler);
  editTodoNoteContainer.addEventListener("click", saveEventHandler);
  editTodoNoteContainer.addEventListener("click", overviewEventHandler);
}

function initialize() {
  renderView();
  initEventHandlers();
}

window.addEventListener("DOMContentLoaded", () => {
  initialize();
});
