import express from 'express';

import {todoNoteController} from '../controller/todo-notes-controller.js';

const router = express.Router();

router.get("/", todoNoteController.getTodoNotes);
router.post("/", todoNoteController.createTodoNote);
router.put("/", todoNoteController.updateTodoNote)
router.get("/:id/", todoNoteController.getTodoNote);

export const todoNoteRoutes = router;
