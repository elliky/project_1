import {todoNoteStore} from '../services/todo-note-store.js'
import { SortAttribute } from './source/public/model/constants.js';

export class TodoNoteController {

    getTodoNotes = async (req, res) => {
        res.json((await todoNoteStore.all()))
    };

    createTodoNote = async (req, res) => {
        res.json(await todoNoteStore.add(req.body.name));
    };

    getTodoNote = async (req, res) => {
        res.json(await todoNoteStore.get(req.params.id));
    };
}

export const todoNoteController = new TodoNoteController();
