const todos = document.querySelector('.todos')
const newValue = document.querySelector('.new-todo-value')
const newTodo = document.querySelector('.new-todo')
const check = document.querySelectorAll('.check')

document.querySelectorAll('.new-todo').forEach(event => {
    event.addEventListener('click', e => {
        newEl(newValue.value)
    })
})

class Store {
    static key = "todo-list"
    static init = false

    /** @return {{text: string, checked: boolean}[]} */
    static getData() {
        const dataString = localStorage.getItem(this.key)

        try {
            return JSON.parse(dataString) || []
        }catch(e) {
            return []
        }
    }

    static restore() {
        const data = this.getData()

        this.init = true

        for(let {text, checked} of data)
            newEl(text, checked)
        
        this.init = false
    }

    static save() {
        if(this.init)
            return null

        /** @type {{text: string, checked: boolean}[]} */
        const data = []

        for(const el of todos.querySelectorAll('.todo')) {
            const text = el.querySelector('p').innerHTML
            const checked = el.querySelector('input').checked
            data.push({text, checked})
        }

        localStorage.setItem(this.key, JSON.stringify(data))
    }
}

const template = `
<input type="checkbox" class="check" />
<p class="todo-title"></p>
<button class="delete-btn">&#10006</button>
`

function newEl (value = '', checked = false) {
    const newEl = document.createElement('li');
    newEl.className = 'todo';
    newEl.innerHTML = template

    newEl.querySelector('input').checked = checked
    newEl.querySelector('input').onchange = checkEl
    newEl.querySelector('button').onclick = removeEL

    checkEl({target: newEl.querySelector('input')})

    newEl.querySelector('p').innerHTML = value
    todos.appendChild(newEl)
    Store.save()
}

/** @param {InputEvent} e */
function checkEl({target}){
    if(target instanceof HTMLInputElement) {
        const p = target.parentElement.querySelector('p')
        p.style.textDecoration = target.checked ? "line-through" : 'none'
        Store.save()
    }
}

/** @param {InputEvent} e */
function removeEL({target}) {
    if(target instanceof HTMLButtonElement) {
        target.parentElement.remove()
        Store.save()
    }
}

Store.restore()