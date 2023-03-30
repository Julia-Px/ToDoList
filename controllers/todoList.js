/**
 * Jak zapewne zaraz zauważysz, to niektóre czynności się powtarzają. Warto wtedy wydzielić je do oddzielnych funkcji, np.
 * 1. Pobranie todolisty z jsona
 * 2. Zapisanie todolisty do jsona
 *
 * Kolejna sprawa to praca nad tablicą Todolist i obiektem Task. Polecam tutaj stworzyć odpowiednie klasy (tak wiem, OOP jest straszne:D) i odpowiednio zaimplementować metody. Wtedy jest prościej. Mogę pomóc.
 *
 *
 */

const { join } = require('path');

const { writeFile, readFile } = require('fs').promises;

const path = join(__dirname, '../data/todoList.json');

const getTodoList = async (req, res) => {
  // pobranie todolisty z jsona
  // zwrócenie todolisty na front  res.json(todoList)
  const todoList = await readFile(path, 'utf8'); //odczytywanie JSONa i odsułanie JSONA
  const todoListJSON = JSON.parse(todoList);
  res.json(todoListJSON);
};

const getOneTask = async (req, res) => {
  // pobranie ID taska z req.params
  // pobranie todolisty z jsona
  // znalezienie konkretnego taska na podstawie ID
  // zwrócenie taska na front res.json(task)

  const id = req.params.id * 1;

  const todoList = await readFile(path, 'utf8');
  const todoListJSON = JSON.parse(todoList);

  const task = todoListJSON.find((el) => el.id === id); // być może tu powinno być let

  if (!task) {
    res.send('Oh no! There is no task with this id');
  } else {
    res.json(task);
  }
};

const addTask = async (req, res) => {
  //post method, czyli że w naszym req coś wysyłamy na serwer(req.body)
  // pobranie danych o nowym tasku z req.body
  // pobranie todolisty z jsona
  // dodanie nowego taska do todolisty
  // zapisanie todolisty do jsona
  // zwrócenie todolisty na front  res.json(todoList)

  const todoList = await readFile(path, 'utf8');
  const todoListJSON = JSON.parse(todoList);

  let newId = 1;

  if (todoListJSON.length > 0) {
    newId = todoListJSON[todoListJSON.length - 1].id + 1; // do id ostatniego obieku tablicy todoList dodajemy 1.
  }

  const newTask = { id: newId, title: req.body.title, isDone: req.body.isDone };

  todoListJSON.push(newTask); //Push nie zwraca nowej tablicy !!! Tylko mutuje tą pierwotną.
  await writeFile(path, JSON.stringify(todoListJSON));

  res.json(newTask);

  res.end();
};

const updateDoneTask = async (req, res) => {
  // pobranie ID taska z req.params
  // pobranie todolisty z jsona
  // znalezienie konkretnego taska na podstawie ID
  // aktualizacja taska: zmiana isDone=true
  // zapisanie todolisty do jsona
  // zwrócenie todolisty na front  res.json(todoList)

  const id = Number(req.params.id);

  const todoList = await readFile(path, 'utf8');
  const todoListJSON = JSON.parse(todoList);

  const taskToUpdateDone = todoListJSON.find((el) => el.id === id);
  const taskIndex = todoListJSON.indexOf(taskToUpdateDone);

  const updateTaskObject = Object.assign(taskToUpdateDone, req.body);

  todoListJSON[taskIndex] = updateTaskObject;

  await writeFile(path, JSON.stringify(todoListJSON));

  res.json(todoListJSON);

  res.end();
};

const updateTask = async (req, res) => {
  // pobranie ID taska z req.params
  // pobranie todolisty z jsona
  // znalezienie konkretnego taska na podstawie ID
  // aktualizacja taska: czyli pewnie sam tytuł
  // zapisanie todolisty do jsona
  // zwrócenie todolisty na front  res.json(todoList)

  const id = Number(req.params.id); // czy nowy tytuł już wpisuje wysyłając zapytanie? Bo ten kontroler niewiele się różni od poprzedniego

  const todoList = await readFile(path, 'utf8');
  const todoListJSON = JSON.parse(todoList);

  const taskToUpdate = todoListJSON.find((el) => el.id === id); // mógłby być też filter
  const taskIndex = todoListJSON.indexOf(taskToUpdate);

  const updateTaskObject = Object.assign(taskToUpdate, req.body);

  todoListJSON[taskIndex] = updateTaskObject;

  await writeFile(path, JSON.stringify(todoListJSON));

  res.json(todoListJSON);

  res.end();
};

const deleteTask = async (req, res) => {
  // pobranie ID taska z req.params
  // pobranie todolisty z jsona
  // znalezienie konkretnego taska na podstawie ID
  // usunięcie taska
  // zapisanie todolisty do jsona
  // zwrócenie todolisty na front  res.json(todoList)

  const id = Number(req.params.id);

  const todoList = await readFile(path, 'utf8');
  const todoListJSON = JSON.parse(todoList);

  const taskToDelete = todoListJSON.find((el) => el.id === id);
  const deletedTaskIndex = todoListJSON.indexOf(taskToDelete);
  todoListJSON.splice(deletedTaskIndex, 1);

  await writeFile(path, JSON.stringify(todoListJSON));

  res.json(todoListJSON);
};

module.exports = {
  getTodoList,
  getOneTask,
  addTask,
  updateDoneTask,
  updateTask,
  deleteTask,
};
