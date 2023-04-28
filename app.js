const form = document.querySelector(".form")
const input = document.querySelector(".input")
const list = document.querySelector(".todosList")
const clearBtn = document.querySelector(".clear")
const clearImg = document.querySelector(".clearImg")
const select = document.querySelector(".filter")
const saveBtn = document.querySelector(".save")

// STATE
let todos = JSON.parse(localStorage.getItem("todos")) || [];
// [ 
//     {value:"Universitetga borish", isDone: true, id:"a12"}, 
//     {value:"Kursga borish", isDone: false, id: "a12232"} 
// ]

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
    localStorage.setItem("todos", JSON.stringify(todos));
    filterTodosByStatus(todos, status).forEach((el) => {
        const checkBox = el.isDone
        list.innerHTML += `<li draggable="true" class="todo" id = '${el.id}'>
            <input class="magic" type="checkbox" ${checkBox == true ? "checked" : ""} onclick = "onCheck('${el.id}')">
            <input disabled="true" value="${el.value}" class="todo_input" type="text" />
            <div class="save">
            <i onclick = "onSave('${el.value}', '${el.id}')" class='bx bx-sm bx-save' ></i>
            </div>
            <div class="cancel">
            <i onclick = "onCancel('${el.value}', '${el.id}')" class='bx bx-md bx-x'></i>
            </div>
            <div class="edit">
            <i onclick = "onEdit('${el.id}')" class="bx bx-sm bxs-pencil"></i>
            </div>
            <div class="delete">
            <i onclick = "deleteTodo('${el.id}')" class="bx bx-sm bx-trash"></i>
            </div>
            </li>`;
    });

    //DRAG AND DROP
    let startIndex
    let dropIndex

    const listDrag = document.getElementsByClassName("todo")
    console.log(listDrag);

    for(let list of listDrag) {
        list.addEventListener("dragstart", (el) => {
         const startId = list.id
         startIndex = todos.findIndex((el) => el.id == startId)
        })
        list.addEventListener("dragend", (el) => {
         el.preventDefault();

        let newTodos = todos.splice(startIndex, 1)
        todos.splice(dropIndex, 0, newTodos[0])
         render()
        })
        list.addEventListener("dragover", (el) => {
         el.preventDefault();
        })
        list.addEventListener("dragleave", (el) => {
         el.preventDefault();
        })
        list.addEventListener("drop", (el) => {
         el.preventDefault();
         const dropId = list.id
         dropIndex = todos.findIndex((el) => el.id == dropId)
        })
     }
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
}

// CHECK
const onCheck = (id) => {
    todos = todos.map((v) => (v.id == id ? {...v, isDone: !v.isDone } : v))
    render()
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
        id: "a" + Date.now(),
        isDone: false
    };

    todos.unshift(newTodo)

    render()

})

// EDIT BUTTON
const onEdit = (id) => {
    const getBtn = (id, className) => document.querySelector(`#${id} .${className}`)

    const editBtn = getBtn(id, "edit")
    const saveBtn = getBtn(id, "save")
    const cancelBtn = getBtn(id, "cancel")

    editBtn.style.display = "none"
    saveBtn.style.display = "flex"
    cancelBtn.style.display = "flex"

    // input "disabled" atribute delete
    const newInp = document.querySelector(`#${id} .todo_input`)
    newInp.disabled = false
    newInp.style.color = "#b0aaca"
    newInp.focus()
    newInp.selectionStart = newInp.value.length;
    newInp.selectionEnd = newInp.value.length;
    // console.log(id);
}

// CANCEL BUTTON
const onCancel = (value, id) => {
    const getBtn = (id, className) => document.querySelector(`#${id} .${className}`)
    
    const editBtn = getBtn(id, "edit")
    const saveBtn = getBtn(id, "save")
    const cancelBtn = getBtn(id, "cancel")

    editBtn.style.display = "block"
    saveBtn.style.display = "none"
    cancelBtn.style.display = "none"

    //inputdagi textni aktivlashtirish va rangini o'zgartirish
    document.querySelector(`#${id} .todo_input`).disabled = true
    document.querySelector(`#${id} .todo_input`).style.color = "#2B1887"

    // inputdagi o'zgarishni olmay, asliga qaytarib qo'yish
    todos = todos.map((v) => (v.id == id ? {...v, value: value } : v))
    render()
}

// SAVE BUTTON
const onSave = (value, id) => {
    const inputEdit = document.querySelector(`#${id} .todo_input`)
    todos = todos.map((v) => (v.id == id ? {...v, value: inputEdit.value } : v))
    render()
}

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

// DRAG AND DROP