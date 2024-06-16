import express from 'express';
import bodyParser from 'body-parser';

import todoNoteRoutes from './routes/todo-note-routes.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static('source/public'));

app.use((req, res, next) => {
    // this console log is ok, because it's a good practice to log server calls
    // eslint-disable-next-line no-console
    console.log(`${req.method  }:${  req.url}`);
    next();
});

app.use("/todoNotes", todoNoteRoutes);

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
});
