const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) return
    console.log('connected to mongodb')

    const db = client.db('TodoApp');

    //DeleteMany
    db.collection('Todos').deleteMany({ text: 'Eat Lunch' })
        .then(res => console.log(res))
    //DeleteOne
    db.collection('Todos').deleteOne({ text: 'To buy food' })
        .then(res => console.log(res))
    //FindOneAndDelete
    db.collection('Todos').findOneAndDelete({ completed: false })
        .then(res => console.log(res))
    //client.close()

    //
    db.collection('Users').deleteMany({ name: 'Nicholas' })
        .then(res => console.log(res))

    db.collection('Users').findOneAndDelete({ _id : new ObjectID("5bfa705326e9e73604dfa173") })
        .then(res => console.log(res))
})