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

app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })

    todo.save()
        .then(doc => res.send(doc))
        .catch(err => res.send(err))
})


app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    })
        .then(todos => res.send({ todos }))
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
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
  });

  app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
  });

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) res.send(404)

    if (body.completed) {
        body.completedAt = new Date().getDate()
    } else { body.completedAt = null }

    Todo.findOneAndUpdate(
        {
            _id: id,
            _creator: req.user._id
        }
        , { $set: body }, { new: true })
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

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(body.email, body.password)
        .then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send(user)
            })
        }).catch(err => {
            res.status(400).send()
        })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }).catch(err => res.status(400))
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

module.exports = { app }