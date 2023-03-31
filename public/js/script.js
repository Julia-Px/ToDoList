/**
 * Dodajemy nasłuchiwacz zdarzeń, który będzie wywoływać funkcję main
 * po załadowaniu całego dokumentu.
 */

/**
 * Pobiera referencje do elementów DOM i przypisuje je do zmiennych.
 */
const prepareDOMElements = () => {
  todoInput = document.querySelector('.todo-input');
  errorInfo = document.querySelector('.error-info');
  addBtn = document.querySelector('.btn-add');
  ulList = document.querySelector('.todolist ul');

  popup = document.querySelector('.popup');
  popupInfo = document.querySelector('.popup-info');
  popupInput = document.querySelector('.popup-input');
  popupAddBtn = document.querySelector('.accept');
  popupCloseBtn = document.querySelector('.cancel');
};

/**
 * Dodaje listenery do elementów DOM.
 */
const prepareDOMEvents = () => {
  addBtn.addEventListener('click', addNewTask);
  ulList.addEventListener('click', checkClick);
  popupCloseBtn.addEventListener('click', closeEdit);
  popupAddBtn.addEventListener('click', changeTodoText);
  todoInput.addEventListener('keyup', enterKeyCheck);
};

/**
 * Pobiera listę zadań z serwera.
 */
const getTodoList = async () => {
  const res = await fetch('/todolist', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

/**
 * Pobiera pojedyncze zadanie z serwera na podstawie jego identyfikatora.
 */
const getOneTask = async (id) => {
  const res = await fetch(`/todolist/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

/**
 * Dodaje nowe zadanie na serwerze.
 */
const addTask = async (newTask) => {
  const res = await fetch(`/todolist`, {
    method: 'POST',
    body: JSON.stringify(newTask),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

/**
 * Usuwa zadanie z serwera na podstawie jego identyfikatora.
 */
const deleteTask = async (id) => {
  const res = await fetch(`/todolist/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Aktualizuje status wykonania zadania na serwerze.
 */
const updateDoneTask = async (id, ToDos) => {
  const res = await fetch(`/todolist/done/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(ToDos),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

/**
 * Aktualizuje tytuł zadania na serwerze.
 */
const updateTask = async (id, updatedTask) => {
  const res = await fetch(`/todolist/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedTask),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};
/**
 * Renderuje listę zadań na stronie.
 */
const renderTodoList = async () => {
  const ToDos = await getTodoList();
  const ul = document.querySelector('#ulList');
  ul.textContent = '';

  for (const task of ToDos) {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const btnComplete = document.createElement('button');
    const btnEdit = document.createElement('button');
    const btnDelete = document.createElement('button');

    li.dataset.id = task.id;
    li.textContent = task.title;
    div.classList.add('tools');
    btnComplete.classList.add('complete');
    btnComplete.innerHTML = '<i class="fas fa-check"></i>';

    // Dodajemy warunek, który sprawdza, czy zadanie jest wykonane
    if (task.isDone) {
      li.classList.add('completed');
      btnComplete.classList.add('completed');
    }
    btnEdit.classList.add('edit');
    btnEdit.textContent = 'EDIT';
    btnDelete.classList.add('delete');
    btnDelete.innerHTML = '<i class="fas fa-times"></i>';

    div.append(btnComplete);
    div.append(btnEdit);
    div.append(btnDelete);
    li.append(div);
    ul.append(li);
  }
};

/**
 * Dodaje nowe zadanie do listy zadań i wysyła je na serwer.
 */
const addNewTask = async () => {
  if (todoInput.value !== '') {
    const newTask = {
      title: todoInput.value,
      isDone: false,
    };
    const addedTask = await addTask(newTask);
    await renderTodoList();
    todoInput.value = '';
    errorInfo.textContent = '';
  } else {
    errorInfo.textContent = 'Wpisz treść zadania!';
  }
};

/**
 * Obsługuje kliknięcia na przyciskach "zakończ", "edytuj" i "usuń".
 */
const checkClick = async (e) => {
  if (e.target.matches('.complete')) {
    const li = e.target.closest('li');
    li.classList.toggle('completed');
    e.target.classList.toggle('completed');
    const taskId = li.dataset.id;
    await updateDoneTask(taskId, { isDone: li.classList.contains('completed') });
  } else if (e.target.matches('.edit')) {
    editTodo(e);
  } else if (e.target.matches('.delete')) {
    const li = e.target.closest('li');
    const taskId = li.dataset.id;
    await deleteTask(taskId);
    li.remove();
  }
};

/**
 * Otwiera okno edycji zadania.
 */
const editTodo = (e) => {
  todoToEdit = e.target.closest('li');
  popupInput.value = todoToEdit.firstChild.textContent;
  popup.style.display = 'flex';
};

/**
 * Zamyka okno edycji zadania.
 */
const closeEdit = () => {
  popup.style.display = 'none';
  popupInfo.textContent = '';
};

/**
 * Zmienia tekst zadania w liście zadań i aktualizuje go na serwerze.
 */
const changeTodoText = async () => {
  if (popupInput.value !== '') {
    const taskId = todoToEdit.dataset.id;
    const updatedTask = await updateTask(taskId, { title: popupInput.value });
    todoToEdit.firstChild.textContent = await updatedTask.title;
    popup.style.display = 'none';
    popupInfo.textContent = '';
  } else {
    popupInfo.textContent = 'Musisz podać jakąś treść!';
  }
};

/**
 * Sprawdza, czy wciskanie klawisza Enter dodaje nowe zadanie.
 */
const enterKeyCheck = (e) => {
  if (e.key === 'Enter') {
    addNewTask();
  }
};
/**

 Główna funkcja inicjalizująca aplikację, uruchamiająca funkcje
 przygotowujące elementy DOM i zdarzenia oraz renderująca listę zadań.
 */
const main = () => {
  prepareDOMElements();
  prepareDOMEvents();
  renderTodoList();
};

document.addEventListener('DOMContentLoaded', main);
