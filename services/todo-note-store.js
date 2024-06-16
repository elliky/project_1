import Datastore from 'nedb-promises'

// nedb generates a _id which isn't used but that doesn't really matter.
export class TodoNoteStore {
    constructor(db) {
        const options = {filename: './data/orders.db', autoload: true};
        this.db = db || new Datastore(options);
    }

    async add(todoNote) {
        const todoNoteToSave = todoNote;
        todoNoteToSave.id = crypto.randomUUID();
        return this.db.insert(todoNoteToSave);
    }
    
    async update(todoNote) {
        // db.update would be cleaner, but it's a lot easier this way
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
