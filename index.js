const express = require('express');
const path = require('path');
const { todolistRouter } = require('./routes/todoList');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/todolist', todolistRouter);

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
