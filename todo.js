//library to access files 
const fs = require('fs')
//take operation input
let operation = process.argv[2]
//take operands input (used in case of add , delete ,done)
let operands = process.argv[3]
//required files (todo.json & done.json)
let todo_path = './todo.txt'
let done_path = './done.txt' 

//function to initialize required files (todo.json & done.json)
const initialize = () => {
    if(!fs.existsSync(todo_path)){
        addTodos([])
    }
    if(!fs.existsSync(done_path)){
        addCompletedTask([])
    }
}

//display all the commands initially by default
const showCommands = () => {
    console.log(`
Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics
    `) 
}

//set data in todo.json
const addTodos = (data) => {
    const incomingData = JSON.stringify(data)
    fs.writeFileSync(todo_path , incomingData)
}

//set data in done.json
const addCompletedTask = (data) => {
    const incomingData = JSON.stringify(data)
    fs.writeFileSync(done_path , incomingData)
}

//function to get todo lists data
const fetchTodos = () => {
    const todoData = fs.readFileSync(todo_path)
    return JSON.parse(todoData)
}

//function to get done lists data
const getCompletedTask = () => {
    const doneData = fs.readFileSync(done_path)
    return JSON.parse(doneData)
}

//function to add new todo
const addNewTodo = (operands) => {
    if(!operands){
        console.log("Error: Missing todo string. Nothing added!")
        return
    }
    let data = fetchTodos()
    data.push({task : operands , date: new Date(Date.now())})
    addTodos(data)
    console.log(`Added todo: "${operands}"`)
}

//function to get Report of the day
const getReport = () => {
    const todos = fetchTodos()
    const doneTodos = getCompletedTask()
    const presentDate = new Date()
    console.log(`${presentDate.getFullYear()}-${presentDate.getMonth()+1}-${presentDate.getDate()} Pending : ${todos.length} Completed : ${doneTodos.length }`)
}

//function to list out remaing todos
const getRemainingTodos = () => {
    const remainingTodos = fetchTodos()
    if(remainingTodos.length === 0) {
        console.log("There are no pending todos!")
    }
    for(let i=remainingTodos.length-1;i>=0 ;i--){
        console.log(`[${i+1}] ${remainingTodos[i].task}`)
    }
}

//function to set particular task done
const setCompletedTask =  (index) => {
    if(!index){
        console.log("Error: Missing NUMBER for marking todo as done.")
        return;
    }
    let data = fetchTodos()
    if(index === '0' || index > data.length){
        console.log(`Error: todo #${index} does not exist.`)
        return;
    }
    let doneData = data.splice(index-1 , 1);
    addTodos(data)
    data = getCompletedTask()
    data.push(doneData[0])
    addCompletedTask(data)
    console.log(`Marked todo #${index} as done.`)
}

//function to delete particular task
const deleteTask = (index) => {
    if(!index){
        console.log("Error: Missing NUMBER for deleting todo.")
        return;
    }
    let data = fetchTodos()
    if(index === '0' || index > data.length){
        console.log(`Error: todo #${index} does not exist. Nothing deleted.`)
        return;
    }
    data.splice(index-1 , 1);
    addTodos(data)
    console.log(`Deleted todo #${index}.`)
}


//calling initiaze function to make required files
initialize()

//switch commands for various operations
switch(operation){
    case "add" :
        addNewTodo(operands);
        break;
    case undefined:
        showCommands();
        break;
    case "help":
        showCommands();
        break;
    case "report":
        getReport();
        break;
    case "ls":
        getRemainingTodos();
        break;
    case "done":
        setCompletedTask(operands);
        break;
    case "del":
        deleteTask(operands);
        break;
}