const { ObjectID } = require('mongodb')

const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todos')
const { User } = require('../server/models/user')

Todo.remove({}).then(res => console.log(res))

//Todo.findOneAndRemove()

//Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5bfd27321dc300820cd9c561')
    .then(todo => console.log(todo))