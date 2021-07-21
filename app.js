const http = require('http');
const express = require('express');
const db = require('./model/db')

const app = express();

const hostname = '127.0.0.1'
const port = 3000
let id = 6

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const server = http.createServer(app);

//get all todos
app.get('/api/v1/todos', (req,res) => {
    res.json(db.todos)
})
//create new todo
app.post('/api/v1/todos', (req,res) => {
    console.log(req.body)
    if(!req.body || !req.body.text) {
        res.status(422).json({
            error: "please include to do text"
        })
        return
    }
    const newTodo = {
        id : id++,
        text : req.body.text,
        completed : false
    }
    db.todos.push(newTodo)
    res.status(201).json(newTodo)
})

//updated existing todo by id
app.patch('/api/v1/todos/:id', (req,res) => {
    //get id from the route
    const id = parseInt(req.params.id)
    //find existing todo
    const todoIndex = db.todos.findIndex((todo)=>{
        return todo.id === id
    })
    if (todoIndex === -1) {
        res.status(404).json({
            error: 'could not find todo with that id'
        })
        return
    }
    //update the todo if one was provided
    if(req.body && req.body.text) {
        db.todos[todoIndex].text = req.body.text
    }
    //update the todo completed status if it was provided
    if(req.body && req.body.completed !== undefined) {
        db.todos[todoIndex].completed = req.body.completed
    }
    //send back response
    res.json(db.todos[todoIndex])
})
//delete existing todo by id
app.delete('/api/v1/todos/:id', (req,rex) => {
    //get the id
    const id = parseInt(req.params.id)
    //find the existing todo
    const todoIndex = db.todos.findIndex((todo)=>{
        return todo.id === id
    })
    //delete the todo
    db.todos.splice(todoIndex, 1)
    //respond with 204 status and empty response
    res.status(204).json()

})
server.listen(port, hostname, ()=>{
    console.log(`Server listening to ${hostname}`)
})