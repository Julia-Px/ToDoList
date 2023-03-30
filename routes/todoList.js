const express = require('express');

const { getTodoList, getOneTask, addTask, updateDoneTask, updateTask, deleteTask } = require('../controllers/todoList');

const todolistRouter = express.Router();

todolistRouter
  // wyświetlamy wszystkie taski
  .get('/', getTodoList)
  // zwracamy pojedynczy task
  .get('/:id', getOneTask)
  // tworzymy nowy task
  .post('/', addTask)
  // aktualizujemy task: wykonany
  .patch('/done/:id', updateDoneTask)
  // aktualizujemy cały task
  .put('/:id', updateTask)
  // usuwamy task
  .delete('/:id', deleteTask);

module.exports = {
  todolistRouter,
};
