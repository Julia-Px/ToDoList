/** Importowanie modułów */
const express = require('express');
const path = require('path');
const { todolistRouter } = require('./routes/todoList');

/** Tworzenie aplikacji express */
const app = express();

/** Używanie parsera JSON i obsługi plików statycznych */
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/** Definiowanie ścieżek dla aplikacji */
app.use('/todolist', todolistRouter);

/** Nasłuchiwanie na porcie 3000 */
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
