/** Importowanie modułu express i kontrolerów */
const express = require('express');
const { getTodoList, getOneTask, addTask, updateDoneTask, updateTask, deleteTask } = require('../controllers/todoList');

/** Tworzenie routera */
const todolistRouter = express.Router();

/** Definiowanie ścieżek dla routera */
todolistRouter

  .get('/', getTodoList)

  .get('/:id', getOneTask)

  .post('/', addTask)

  .patch('/done/:id', updateDoneTask)

  .put('/:id', updateTask)

  .delete('/:id', deleteTask);

module.exports = {
  todolistRouter,
};
