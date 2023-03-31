/**
 * Wprowadziłem następujące poprawki:
 *
 * 1. Dodałem bloki `try-catch` do wszystkich funkcji kontrolera, aby obsłużyć błędy i wysłać odpowiedni kod statusu w przypadku błędu.
 * 2. Zaktualizowałem metody `updateDoneTask` i `updateTask`, aby bezpośrednio modyfikować właściwości obiektów zadań zamiast używania `Object.assign()`.
 * 3. Zaktualizowałem metodę `deleteTask`, aby używać `findIndex()` zamiast kombinacji `find()` i `indexOf()`.
 *
 * Z powyższymi poprawkami, kod powinien być bardziej wydajny, zrozumiały i odporny na błędy.
 */

/** Importowanie niezbędnych modułów */
const { join } = require('path');
const { writeFile, readFile } = require('fs').promises;
const path = join(__dirname, '../data/todoList.json');

/** Odczytywanie jednego zadania na podstawie przekazanego ID */
const getTodoList = async (req, res) => {
  try {
    const todoList = await readFile(path, 'utf8');
    const todoListJSON = JSON.parse(todoList);
    res.json(todoListJSON);
  } catch (err) {
    res.status(500).send('Error retrieving the list of tasks');
  }
};

/** Dodawanie nowego zadania do listy */
const getOneTask = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const todoList = await readFile(path, 'utf8');
    const todoListJSON = JSON.parse(todoList);
    const task = todoListJSON.find((el) => el.id === id);

    if (!task) {
      res.status(404).send('Oh no! There is no task with this id');
    } else {
      res.json(task);
    }
  } catch (err) {
    res.status(500).send('Error retrieving the task');
  }
};

/** Dodawanie nowego zadania do listy */
const addTask = async (req, res) => {
  try {
    const todoList = await readFile(path, 'utf8');
    const todoListJSON = JSON.parse(todoList);
    const newId = todoListJSON.length > 0 ? todoListJSON[todoListJSON.length - 1].id + 1 : 1;

    const newTask = { id: newId, title: req.body.title, isDone: req.body.isDone };
    todoListJSON.push(newTask);
    await writeFile(path, JSON.stringify(todoListJSON));

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).send('Error adding the task');
  }
};

/** Aktualizacja statusu zadania (zrobione/niezrobione) */
const updateDoneTask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const todoList = await readFile(path, 'utf8');
    const todoListJSON = JSON.parse(todoList);

    const taskToUpdateDone = todoListJSON.find((el) => el.id === id);
    if (!taskToUpdateDone) {
      res.status(404).send('Task not found');
      return;
    }

    taskToUpdateDone.isDone = req.body.isDone;
    await writeFile(path, JSON.stringify(todoListJSON));

    res.json(taskToUpdateDone);
  } catch (err) {
    res.status(500).send('Error updating the task status');
  }
};

/** Aktualizacja zadania (tytułu) */
const updateTask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const todoList = await readFile(path, 'utf8');
    const todoListJSON = JSON.parse(todoList);

    const taskToUpdate = todoListJSON.find((el) => el.id === id);
    if (!taskToUpdate) {
      res.status(404).send('Task not found');
      return;
    }

    taskToUpdate.title = req.body.title;
    await writeFile(path, JSON.stringify(todoListJSON));

    res.json(taskToUpdate);
  } catch (err) {
    res.status(500).send('Error updating the task');
  }
};

/** Usuwanie zadania */
const deleteTask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const todoList = await readFile(path, 'utf8');
    const todoListJSON = JSON.parse(todoList);
    const taskToDeleteIndex = todoListJSON.findIndex((el) => el.id === id);
    if (taskToDeleteIndex === -1) {
      res.status(404).send('Task not found');
      return;
    }

    todoListJSON.splice(taskToDeleteIndex, 1);
    await writeFile(path, JSON.stringify(todoListJSON));

    res.status(200).end();
  } catch (err) {
    res.status(500).send('Error deleting the task');
  }
};

/** Eksportowanie funkcji do używania w innych plikach */
module.exports = {
  getTodoList,
  getOneTask,
  addTask,
  updateDoneTask,
  updateTask,
  deleteTask,
};
