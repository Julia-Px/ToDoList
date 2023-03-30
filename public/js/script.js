let todoInput;
/* można zapisać tak: let todoInput, errorInfo, ... */
let errorInfo;
let addBtn;
let ulList;
let newTask; // nowo dodane Li, nowe zadanie
let popup; // popup
let popupInfo; // tekst w popupie, jak się doda pusty tekst
let todoToEdit; // edytowany Todu
let popupInput; // input w popupie
let popupAddBtn; //przycisk "zatwierdź" w popupie
let popupCloseBtn; // przycisk "anuluj" w popupie

const main = () => {
  prepareDOMElements();
  prepareDOMEvents();
};

const prepareDOMElements = (params) => {
  // pobieramy wszystkie nasze elementy
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
  // nadajemy nasłuchiwanie
  addBtn.addEventListener('click', addNewTask);
  ulList.addEventListener('click', checkClick);
  popupCloseBtn.addEventListener('click', closeEdit);
  popupAddBtn.addEventListener('click', changeTodoText);
  todoInput.addEventListener('keyup', enterKeyCheck);
};

/**
 * Musimy stworzyć taką samą pojedynczą strukturę html, ale w JS
 * <li data-id='test1'>Zadanie 1
 *                     <div class="tools">
 *                         <button class="complete"><i class="fas fa-check"></i></button>
 *                         <button class="edit">EDIT</button>
 *                         <button class="delete"><i class="fas fa-times"></i></button>
 *                     </div>
 *  </li>
 *
 *  Możemy to wykonać na 2 sposoby, z czego jeden jest bezpieczniejszy, ale trudniejszy, wiec z skorzystamy z niego:
 */

const getTodoList = async () => {
  //działa w konsoli
  // jak połączyć to tak żeby na stornie, po wejściu na nią, wyświetliła mi się moja todo lista (to co mama w pliku json)??
  const res = await fetch('/todolist', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  ToDos = data;
};

const getOneTask = async (id) => {
  const res = await fetch(`/todolist/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  ToDos = data; // czemu tutaj ToDo?
};

const addTask = async (newTask) => {
  const res = await fetch(`/todolist`, {
    method: 'POST',
    body: JSON.stringify(newTask),
    headers: {
      'Content-Type': 'application/json',
    },
  });
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
  ToDos = data;
};

const renderTodoList = async () => {
  const ToDos = await getTodoList();
  // Pobieramy ul, bo tam będziemy wrzucać nasze taski: To jak widzę jest robione
  const ul = document.querySelector('#ulList');
  // Warto na początku czyścić ul, by się na froncie nie nadpisywało
  ul.textContent = '';
  // Następnie tworzymy pętle: Zrobione
  for (const task of ToDos) {
    // Tworzymy li: Tutaj nazwałbym to po prostu li:
    const li = document.createElement('li');
    // Tworzymy diva
    const div = document.createElement('div');
    // Tworzymy button, a nawet dla uproszczenia od razu 3. Dałby się to krócej, ale już nie popadajmy w skrajność:)
    const btnComplete = document.createElement('button');
    const btnEdit = document.createElement('button');
    const btnDelete = document.createElement('button');
    // Nadajemy odpowiednie klasy i wartości
    li.dataset.id = task.id;
    li.textContent = task.title;
    div.classList.add('tools');
    btnComplete.classList.add('complete');
    btnComplete.innerHTML = '<i class="fas fa-check"></i>';
    btnEdit.classList.add('edit');
    btnEdit.textContent = 'EDIT';
    btnDelete.classList.add('delete');
    btnDelete.innerHTML = '<i class="fas fa-times"></i>';

    // Teraz musimy wszystko ładnie poukładać:
    div.append(btnComplete);
    div.append(btnEdit);
    div.append(btnDelete);
    li.append(div);
    ul.append(li);

    /**
     * I już mamy ładną funkcję renderującą wszystkie taski na podstawie tablicy :) Można ją nazwać renderTodoList, by było wiadomo o co chodzi:) dodatkowo powinna  przyjmować jako argument tablicę z todolistą. Będziemy jej używać za każdym razem przy jakichkolwiek zmianach.
     */
  }
};

/**
 * Mając już ładną funkcję renderującą todolistę możemy skupić się na dodawaniu nowego tasku
 */
function addNewTask(newTask) {
  if (todoInput.value !== '') {
    // Tworzymy nowego taska
    // Tutaj póki co na sztywno dodajemy ID, potem będzie generowany z backendu
    const newTask = {
      id: 123123,
      title: todoInput.value,
      idDone: false,
    };

    // I wrzucamy go do ToDos
    ToDos.push(newTask);

    // Na koniec renderujemy zaaktualizowaną listę
    renderTodoList(ToDos);
    todoInput.value = '';
    errorInfo.textContent = '';
  } else {
    errorInfo.textContent = 'Wpisz treść zadania!';
  }
}

/**
 * Póki co kod nie działa idealnie, ponieważ żeby było szybciej to resztę rzeczy trzeba najpierw zaimplementować na backendzie.
 * Potem wrócimy do frontu, by zmienić funkcje edit i delete.
 * W przypadku funkcji AddNew (warto dla czytelności nazwać ją chociaż AddNewTask), jak już backend będzie działać dobrze, będziemy musieli użyć fetcha do przesłania danych do backendu. Wtedy wszystko będzie działać sprawnie :)
 *
 */

const checkClick = (e) => {
  if (e.target.matches('.complete')) {
    e.target
      .closest('li')
      .classList.toggle('completed'); /* tutaj dodajemy sobie klasę completed na dziadku naszego przycisku button */
    e.target.classList.toggle(
      'completed',
    ); /* tutaj dodajemy sobie klasę completed na naszym ptaszku. Używając e.target odnosimy się do elementu który klikamy */
  } else if (e.target.matches('.edit')) {
    /* wywoływanie popupa */
    editTodo(e);
    /* 2) W nawiasie wpisujemy e. W ten sposób przekazujemy do funkcji nasz paremetr e z funkcji clickCheck */
  } else if (e.target.matches('.delete')) {
    deleteTodo(e);
  }
};

const editTodo = (e) => {
  todoToEdit = e.target.closest('li');
  /* e.target -> element w który będziemy klikali. Dlatego dalej wskazujemy na najbliższe li. Dosłownie - tam gdzie klikniemy to weź najbliższe li */
  popupInput.value = todoToEdit.firstChild.textContent; /* FirstChild to tekst naszego li (todoToEdit) */
  console.log(todoToEdit.firstChid);
  popup.style.display = 'flex';
};

const closeEdit = () => {
  popup.style.display = 'none';
  popupInfo.textContent = '';
};

const changeTodoText = () => {
  if (popupInput.value !== '') {
    todoToEdit.firstChild.textContent = popupInput.value;
    popup.style.display = 'none';
    popupInfo.textContent = ''; /* Musimy to dodać też tutaj żeby się nie pokazywało 'Musisz podać jakąś treść!'*/
  } else {
    popupInfo.textContent = 'Musisz podać jakąś treść!';
  }
};

const deleteTodo = (e) => {
  e.target.closest('li').remove();
  const allTodos =
    ulList.querySelectorAll(
      'li',
    ); /* Pobieramy sobie wszystkie nasze Todosy. Ważne jest żeby to było pod  e.target.closest('li').remove()*/
  if (allTodos.length === 0) {
    errorInfo.textContent = 'Brak zadań na liście';
  }
};

const enterKeyCheck = (e) => {
  if (e.key === 'Enter') {
    addNewTask();
  }
};

document.addEventListener('DOMContentLoaded', main);
/* Jest to event który sprawie że mamy
takie zabezpieczenie że nasze skrypty nie uruchomią się dopóki
cała strona nie zostanie wczytana (jak dokument zostanie załadowany to odpal funkcję main)
 */

renderTodoList();
// renderTodoList(ToDos);
// getOneTask(id);
// addTask(newTask);
// deleteTask(id);
// updateDoneTask(id, ToDos);
