const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')


const { app } = require('../server')
const { Todo } = require('../models/todos')

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
    app.close
})

describe('POST /todos', () => {
    it('should created a new todo', done => {
        let text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) done(err)

                Todo.find({ text }).then(todos => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((err) => done(err))
            })
    })

    // it('Should not create todo with invalid body data', done => {
    //     request(app)
    //         .post('/todos')
    //         .send({})
    //         .expect(400)
    //         .end((err, res) => {
    //             if (err) { done(err) }

    //             Todo.find().then(todos => {
    //                 expect(todos.length).toBe(0)

    //                 //done()
    //             }).catch(err => done(err))
    //         })
    // })
})

describe(('GET /todos'), () => {
    it('Should get all todos', done => {
        request(app.listen())
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe(('GET /todos/:id'), () => {
    it('should return todo doc', done => { 
        request(app.listen())
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('Shoud return 400 if todo not found', done => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(400)
            .end(done)
    })

    it('it should return 404 for non-Object ids', done => {
        request(app)
            .get('/todos/123abc')
            .expect(400)
            .end(done)
        done()
    })
})