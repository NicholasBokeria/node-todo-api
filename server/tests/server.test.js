const expect = require('expect')
const request = require('supertest')

const { app } = require('../server')
const { Todo } = require('../models/todos')

const todos = [{
    text: 'First test todo'
}, {
    text: 'Second test todo'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
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