/**
 * Wprowadzone zmiany:
 * 1. Dodanie funkcji enterKeyCheckPopup, która sprawdza czy wciśnięto klawisz Enter w polu input popupInput.
 * 2. Dodanie nasłuchiwacza zdarzeń dla popupInput.
 * 3. Zrefaktoryzowano funkcje komunikujące się z API, wprowadzając funkcję fetchAPI() do obsługi zapytań.
 * 4. Dodanie funkcji handleListClick, która obsługuje kliknięcia na przyciskach "zakończ", "edytuj" i "usuń".
 * 5. Dodanie funkcji toggleTaskCompletion, która przełącza status wykonania zadania.
 * 6. Dodanie funkcji deleteTaskAndRender, która usuwa zadanie z listy zadań i renderuje listę na stronie.
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
  ulList.addEventListener('click', handleListClick);
  popupCloseBtn.addEventListener('click', closeEdit);
  popupAddBtn.addEventListener('click', changeTodoText);
  todoInput.addEventListener('keyup', enterKeyCheck);
  popupInput.addEventListener('keyup', enterKeyCheckPopup); // Dodajemy nasłuchiwacz zdarzeń dla popupInput
};

/**
 *  Główna funkcja obsługująca zapytania do API.
 */
const fetchAPI = async (url, method = 'GET', body = null, headers = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();
  return data;
};

/**
 * Pobiera listę zadań z serwera.
 */
const getTodoList = async () => {
  return await fetchAPI('/todolist');
};

/**
 * Pobiera pojedyncze zadanie z serwera na podstawie jego identyfikatora.
 */
const getOneTask = async (id) => {
  return await fetchAPI(`/todolist/${id}`);
};

/**
 * Dodaje nowe zadanie na serwerze.
 */
const addTask = async (newTask) => {
  return await fetchAPI('/todolist', 'POST', newTask);
};

/**
 * Usuwa zadanie z serwera na podstawie jego identyfikatora.
 */
const deleteTask = async (id) => {
  await fetchAPI(`/todolist/${id}`, 'DELETE');
};

/**
 * Aktualizuje status wykonania zadania na serwerze.
 */
const updateDoneTask = async (id, doneTask) => {
  return await fetchAPI(`/todolist/done/${id}`, 'PATCH', doneTask);
};

/**s
 * Aktualizuje tytuł zadania na serwerze.
 */
const updateTask = async (id, updatedTask) => {
  return await fetchAPI(`/todolist/${id}`, 'PUT', updatedTask);
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
    await addTask(newTask);
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
const handleListClick = async (e) => {
  if (e.target.matches('.complete')) {
    await toggleTaskCompletion(e);
  } else if (e.target.matches('.edit')) {
    editTodo(e);
  } else if (e.target.matches('.delete')) {
    await deleteTaskAndRender(e);
  }
};

/**
 * Przełącza status wykonania zadania.
 */
const toggleTaskCompletion = async (e) => {
  const li = e.target.closest('li');
  li.classList.toggle('completed');
  e.target.classList.toggle('completed');
  const taskId = li.dataset.id;
  await updateDoneTask(taskId, { isDone: li.classList.contains('completed') });
};

/**
 * Usuwa zadanie z listy zadań i z serwera.
 */
const deleteTaskAndRender = async (e) => {
  const li = e.target.closest('li');
  const taskId = li.dataset.id;
  await deleteTask(taskId);
  li.remove();
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
 * Sprawdza, czy wciskanie klawisza Enter aktualizuje zadanie w okienku popup.
 */
const enterKeyCheckPopup = (e) => {
  if (e.key === 'Enter') {
    changeTodoText();
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

/**
 * Dodajemy nasłuchiwacz zdarzeń, który będzie wywoływać funkcję main
 * po załadowaniu całego dokumentu.
 */
document.addEventListener('DOMContentLoaded', main);
