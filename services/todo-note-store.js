import Datastore from 'nedb-promises'
// import TodoNote from '../source/public/model/todo-note.js'

export class TodoNoteStore {
    constructor(db) {
        const options = {filename: './data/orders.db', autoload: true};
        this.db = db || new Datastore(options);
    }

    async add(todoNote) {
        console.log('was is incoming:', todoNote);
        const todoNoteToSave = todoNote;
        todoNoteToSave.id = crypto.randomUUID();
        return this.db.insert(todoNoteToSave);
    }
    
    async update(todoNote) {
        console.log(todoNote);

        // this.db.udpate didn't work as expected
        this.db.removeOne({ id: todoNote.id });
        return this.db.insert(todoNote);
    }

    async get(id) {
        return this.db.findOne({id});
    }

    async all() {
        return this.db.find({}).exec();
    }
}

export const todoNoteStore = new TodoNoteStore();
