require('./config/config.js');

const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');

const {
    mongoose
} = require('./db/mongoose');
const {
    ObjectID
} = require('mongodb');
const {
    Todo
} = require('./models/todos');
const {
    User
} = require('./models/user');
const {
    authenticate
} = require('../middleware/authentication');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {

    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save()
        .then(doc => res.send(doc))
        .catch(err => res.send(err))
})

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
            _creator: req.user._id
        })
        .then(todos => {
            //console.log(req) from middleware
            res.send({
                todos
            })
        })
        .catch(err => res.send(err))
})

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        })

        if (!todo) {
            throw new Error(res.status(404).send())
        }

        res.send(todo)
    } catch (e) {
        console.log(e)
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) res.send(404)

    if (body.completed) {
        body.completedAt = new Date().getDate()
    } else {
        body.completedAt = null
    }

    Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
            $set: body
        }, {
            new: true
        })
        .then(todo => {
            if (!todo) res.status(404).send()

            res.send({
                todo
            })
        })
        .catch(err => res.send(404))
})




app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});