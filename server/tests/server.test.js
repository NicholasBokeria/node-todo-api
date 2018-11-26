const expect = require('expect')
const request = require('supertest')

const { app } = require('../server')
const { Todo } = require('../models/todos')

beforeEach((done) => {
    Todo.remove({}).then(() => {
        done()
    })
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

                Todo.find().then(todos => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((err) => done(err))
            })
    })

    it('Should not create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) { done(err) }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(0)

                    //done()
                }).catch(err => done(err))
            })
    })
})