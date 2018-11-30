const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')

const { Todo } = require('./../../models/todos')
const { User } = require('./../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}]

const users = [{
    _id: new ObjectID(),
    email: 'bokeria@gmail.com',
    password: '123abc',
    tokens: [{
        acces: 'auth',
        token: jwt.sign({_id: userOneId, acces: 'auth'},'abc123').toString()
    }]
}, {
    _id: new ObjectID(),
    email: 'bokeria01@gmail.com',
    password: '123abc'
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save()
        let userTwo = new User(users[1]).save()

        return Promise.all([userOne, userTwo])
    }).then(() => done())
}

module.exports = {
    todos, populateTodos, users, populateUsers
}