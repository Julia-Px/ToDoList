let errorInfo;
let addBtn;
let ulList;
let newTask;
let popup;
let popupInfo;
let todoToEdit;
let popupInput;
let popupAddBtn;
let popupCloseBtn;

const main = () => {
  prepareDOMElements();
  prepareDOMEvents();
  renderTodoList();
};

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

const prepareDOMEvents = () => {
  addBtn.addEventListener('click', addNewTask);
  ulList.addEventListener('click', checkClick);
  popupCloseBtn.addEventListener('click', closeEdit);
  popupAddBtn.addEventListener('click', changeTodoText);
  todoInput.addEventListener('keyup', enterKeyCheck);
};

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

const deleteTask = async (id) => {
  const res = await fetch(`/todolist/${id}`, {
    method: 'DELETE',
  });
};

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

const editTodo = (e) => {
  todoToEdit = e.target.closest('li');
  popupInput.value = todoToEdit.firstChild.textContent;
  popup.style.display = 'flex';
};

const closeEdit = () => {
  popup.style.display = 'none';
  popupInfo.textContent = '';
};

const changeTodoText = async () => {
  if (popupInput.value !== '') {
    const taskId = todoToEdit.dataset.id;
    const updatedTask = await updateTask(taskId, { title: popupInput.value });
    console.log(updatedTask);
    todoToEdit.firstChild.textContent = await updatedTask.title;
    popup.style.display = 'none';
    popupInfo.textContent = '';
  } else {
    popupInfo.textContent = 'Musisz podać jakąś treść!';
  }
};

const enterKeyCheck = (e) => {
  if (e.key === 'Enter') {
    addNewTask();
  }
};

document.addEventListener('DOMContentLoaded', main);
