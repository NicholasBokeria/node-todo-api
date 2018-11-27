const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { ObjectID } = require('mongodb')
const { Todo } = require('./models/todos')
const { User } = require('./models/user')

const app = express();

app.use(bodyParser.json())
//CRUD = Create Read Update Delete

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })

    todo.save()
        .then(doc => res.send(doc))
        .catch(err => res.send(err))
})

app.get('/todos', (req, res) => {
    Todo.find()
        .then(todos => res.send({ todos }))
        .catch(err => res.send(err))
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) return console.log('ID is valid')

    Todo.findById(id)
        .then(todo => {
            if (!todo) {
                res.status(400).send()
            }
            res.send({ todo })
        })
        .catch(err => res.send(err))
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

module.exports = { app }