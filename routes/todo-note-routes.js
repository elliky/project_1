import express from 'express';

import TodoNoteController from '../controller/todo-notes-controller.js';

const todoNoteRoutes = express.Router();

todoNoteRoutes.get("/", TodoNoteController.getTodoNotes);
todoNoteRoutes.post("/", TodoNoteController.createTodoNote);
todoNoteRoutes.put("/", TodoNoteController.updateTodoNote)
todoNoteRoutes.get("/:id/", TodoNoteController.getTodoNote);

export default todoNoteRoutes; 
