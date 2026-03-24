const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todolist")
const remaining = document.getElementById("remainingCount")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
let todoText;//This should be populated when user can click on add button
let todos = []
let todosString = localStorage.getItem("todos")
let currentFilter = 'all';

document.getElementById('allTodos').addEventListener('click', () => {
    currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('allTodos').classList.add('active');
    populateTodos();
    checkbtn();
});

document.getElementById('active').addEventListener('click', () => {
    currentFilter = 'active';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('active').classList.add('active');
    populateTodos();
    checkbtn();
});

document.getElementById('completed').addEventListener('click', () => {
    currentFilter = 'completed';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('completed').classList.add('active');
    populateTodos();
    checkbtn();
});



// if we have todos in the localStorage, we will read it
if (todosString) {
    todos = JSON.parse(todosString);
    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
}

const populateTodos = () => {
    const filtered = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.isCompleted;
        if (currentFilter === 'completed') return todo.isCompleted;
        return true;
    });

    let string = "";
    for (const todo of filtered) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
                        <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "Checked" : ""}>
                        <span class="todo-text">${todo.title}</span>
                        <button class="delete-button">&times;</button>
                   </li>`
    }
    todoListUl.innerHTML = string;


    //handle the clear completed button click
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter((todo) => todo.isCompleted == false)
        populateTodos()
        checkbtn()
        localStorage.setItem("todos", JSON.stringify(todos))
    })

    //handle the delete buttons
    let deleteBtns = document.querySelectorAll(".delete-button")
    deleteBtns.forEach((element) => {
        element.addEventListener('click', (e) => {
            const todoId = element.parentNode.id
            const confirmation = confirm("Do you want to delete this todo ")
            if (confirmation) {
                todos = todos.filter((todo) => {
                    return (todo.id) !== todoId
                })
                remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
                localStorage.setItem("todos", JSON.stringify(todos))
                populateTodos()
                checkbtn()
            }
        })
    })
}

function inputText() {
    todoText = inputTag.value
    //check if the length of todos is greater than 3 characters
    if (todoText.trim().length < 4) {
        alert("You cannot add a todo that small!")
        return
    }
    inputTag.value = ""
    let todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    }
    todos.push(todo)
    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
    localStorage.setItem('todos', JSON.stringify(todos))
    populateTodos()
    checkbtn()


}

inputTag.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') inputText();
});
addTodoBtn.addEventListener('click', inputText)
populateTodos()
checkbtn()
function checkbtn() {
    const todoCheckboxes = document.querySelectorAll(".todo-checkbox")
    todoCheckboxes.forEach((element) => {
        element.addEventListener("click", (e) => {
            if (e.target.checked) {
                element.parentNode.classList.add("completed")
                //Grab this todo from todos array and Update the array to set this todo's is completed atttribute is true
                todos = todos.map(todo => {
                    if (todo.id == element.parentNode.id) {
                        return { ...todo, isCompleted: true }
                    }
                    else {
                        return todo
                    }
                })
                remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
                localStorage.setItem("todos", JSON.stringify(todos))
            }

            else {
                element.parentNode.classList.remove("completed")
                //Grab this todo from todos array and Update the array to set this todo's is completed atttribute is false
                todos = todos.map(todo => {
                    if (todo.id == element.parentNode.id) {
                        return { ...todo, isCompleted: false }
                    }
                    else {
                        return todo
                    }
                })
                remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
                localStorage.setItem("todos", JSON.stringify(todos))
            }
        })
    })

}

