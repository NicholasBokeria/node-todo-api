const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if(error) return

    var user = {name: 'Nicholas', age: 17}
    var {name} = user
    var {age} = user

    console.log(name, age)

    console.log('connected to mongodb')

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'go to school',
    //     completed: false
    // }, (error, result) => {
    //     if(error) console.log('Unable to add')
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    db.collection('Users').insertOne({
        name: 'Nicholas',
        age: 17,
        location: 'Lagodekhi'
    }, (err, res) => {
        if(!err) console.log(res.ops)
    })

    client.close()
})