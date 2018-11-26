const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

var newTodo = new Todo({
    text: 'Wath TED'
})

newTodo.save()
    .then(res => console.log(JSON.stringify(res, undefined, 2)))
    .catch(err => console.log(err))

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
})

var newUser = new User({
    email: 'nikolozbokeria01@gmail.com'
})

newUser.save()
    .then(res => console.log(JSON.stringify(res, undefined, 2)))
    .catch(err => console.log(err))

