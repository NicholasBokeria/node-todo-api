const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) return
    console.log('connected to mongodb')


    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5bfa6a1a26e9e73604dfa082')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then(result => console.log(result))

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bfa705f26e9e73604dfa177')
    }, {
        $set: {
            name: 'Nicholas'
        },
        $inc: {
            age: -1
        }
    }, {
        returnOriginal: false
    }).then(res => console.log(res))

    client.close()
})