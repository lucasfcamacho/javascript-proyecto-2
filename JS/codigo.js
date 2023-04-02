const todoList = document.getElementById('todo-list');
const btnTodo = document.getElementById('btn-todo');
const btnCompleted = document.getElementById('btn-completed');
const btnAll = document.getElementById('btn-all');
const loader = document.getElementById('loader');

function showLoader(show) {
    if (show) {
        loader.classList.add('show');
    } else {
        loader.classList.remove('show');
    }
}

function handleError(error) {
    console.error(error)
}

function updateTodo(todo, completed) {
    showLoader(true);

    fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...todo,
            completed
        })
    })
        .then(res => res.json())
        .then(() => { console.log('updated!'); })
        .catch(handleError)
        .finally(() => showLoader(false));
}

function mostrarTodos(todos) {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const div = document.createElement('div');
        div.className = 'todo';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `todo-${todo.id}`;
        input.checked = todo.completed;

        input.addEventListener('change', e => {
            updateTodo(todo, input.checked);
        });

        const label = document.createElement('label');
        label.textContent = todo.title;
        label.htmlFor = `todo-${todo.id}`;

        div.append(input, label);

        todoList.append(div);
    });
}

function marcarBoton(type) {
    btnTodo.classList.remove('selected');
    btnCompleted.classList.remove('selected');
    btnAll.classList.remove('selected');

    if (type === 'todo') {
        btnTodo.classList.add('selected');
    } else if (type === 'completed') {
        btnCompleted.classList.add('selected');
    } else {
        btnAll.classList.add('selected');
    }
}

function handleClickTodo() {
    marcarBoton('todo');
    getTodos('completed=false');
}

function handleClickCompleted() {
    marcarBoton('completed');
    getTodos('completed=true');
}

function handleClickAll() {
    marcarBoton('all');
    getTodos();
}

function getTodos(filtro) {
    let baseURL = 'https://jsonplaceholder.typicode.com/todos';

    if (filtro) {
        baseURL += `?${filtro}`;
    }

    showLoader(true);

    fetch(baseURL)
        .then(res => res.json())
        .then(mostrarTodos)
        .catch(handleError)
        .finally(() => showLoader(false));
}

btnTodo.addEventListener('click', handleClickTodo);
btnCompleted.addEventListener('click', handleClickCompleted);
btnAll.addEventListener('click', handleClickAll);

getTodos();