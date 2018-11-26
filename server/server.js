const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
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

app.listen(3000, () => {
    console.log('Server started on port 3000')
})