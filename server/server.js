require('./config/config.js')

const _ = require('lodash')

const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { ObjectID } = require('mongodb')
const { Todo } = require('./models/todos')
const { User } = require('./models/user')
const { authenticate } = require('../middleware/authentication')

const app = express();
const port = process.env.PORT;

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true)

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

app.get('/', (req, res) => { res.send('Send nudes babe') })

app.get('/todos', (req, res) => {
    Todo.find()
        .then(todos => res.send({ todos }))
        .catch(err => res.send(err))
})

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

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

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    Todo.findByIdAndRemove(id)
        .then(todo => res.send({ todo }))
        .catch(err => console.log(err))
})

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) res.send(404)

    if (body.completed) {
        body.completedAt = new Date().getDate()
    } else { body.completedAt = null }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then(todo => {
            if (!todo) res.status(404).send()

            res.send({ todo })
        })
        .catch(err => res.send(404))
})

// POST /users

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password'])
    let user = new User(body)

    user.save()
        .then(() => user.generateAuthToken())
        .then(token => {
            res.header('x-auth', token).send(user)
        })
        .catch(err => {
            res.status(404).send()
        })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

module.exports = { app }