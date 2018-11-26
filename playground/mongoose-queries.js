const { ObjectID } = require('mongodb')

const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todos')
const { User } = require('../server/models/user')

var id = "5bfaf50e1a8ee91940292a39";

User.findById(id)
    .then(user => console.log(user))
    .catch(err => console.log(err))

//if(!ObjectID.isValid(id)) console.log('ID isnt valid')

// Todo.find({
//     _id: id
// }).then(todos => {
//     if (todos == null) console.log('ID isn"t exist')
//     else console.log('Todos', todos)
// })

// Todo.findOne({
//     _id: id
// }).then(todo => {
//     if (todo == null) console.log('ID isn"t exist')
//     else console.log('Todo', todo)
// })

// Todo.findById(id)
//     .then(todo => {
//         if (todo == null) console.log('ID isn"t exist')
//         else console.log('Todo by ID', todo)
//     }).catch(err => console.log(err))

