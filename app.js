const form = document.querySelector(".form")
const input = document.querySelector(".input")
const list = document.querySelector(".todosList")
const clearBtn = document.querySelector(".clear")
const clearImg = document.querySelector(".clearImg")
const select = document.querySelector(".filter")

// STATE
let todos = [ 
    {value:"Universitetga borish", isDone: true, id:"12"}, 
    {value:"Kursga borish", isDone: false, id: "12232"} 
]

// STATUS
let status = "all";

const filterTodosByStatus = (todos, status) => {
    switch (status) {
        case "completed":
            return todos.filter((v) => v.isDone)
        case "proccess":
            return todos.filter((v) => !v.isDone)
        
            default:
                return todos;
    }
}

// RENDERING
const render = () => {
    list.innerHTML = ""
    filterTodosByStatus(todos, status).forEach((el) => {
        const checkBox = el.isDone
        list.innerHTML += `<li class="todo">
            <input class="magic" type="checkbox" ${checkBox == true ? "checked" : ""} onclick = "onCheck('${el.id}')">
            <input value="${el.value}" class="todo_input" type="text" />
            <div class="edit">
            <i class="bx bx-sm bxs-pencil"></i>
            </div>
            <div class="delete">
            <i onclick = "deleteTodo('${el.id}')" class="bx bx-sm bx-trash"></i>
            </div>
            </li>`;
    });
}
render()

// DELETE BUTTON
const deleteTodo = (id) => {
    todos = todos.filter((v) => v.id != id);
    render()
    if(list.innerHTML == ""){
        todos = []
        clearImg.style.display = "block";
    }
    // console.log("delete", id);
}

// CHECK
const onCheck = (id) => {
    todos = todos.map((v) => (v.id == id ? {...v, isDone: !v.isDone } : v))
    render()
    console.log(todos);
}

// ADD BUTTON
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputValue = event.target["todo"].value;
    event.target["todo"].value = ""
    if(inputValue == ""){
        input.style.border = "2px solid #cd3838";
        // alert("Biror nima yozing ✍")
        return
    }else {
        input.style.border = "1px solid #735EFA";
    }
    clearImg.style.display = "none";
    const newTodo = {
        value: inputValue,
        id: Date.now() + "#",
        isDone: false
    };

    todos.unshift(newTodo)

    render()

})

// CLEAR BUTTON
clearBtn.onclick = function() {
    list.innerHTML = ""
    todos = []
    clearImg.style.display = "block";
}

select.addEventListener("change", (event) => {
    status = event.target.value;
    render();
})

