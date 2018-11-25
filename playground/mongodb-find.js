const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) return
    console.log('connected to mongodb')


    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5bfa4e543fa5071a057c77fd')
    // })
    //     .toArray()
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))
    db.collection('Todos').find({completed: false})
    .count()
    .then(res => console.log(`To complete:${res}`))

    db.collection('Todos').find({completed: true})
    .count()
    .then(res => console.log(`Completed:${res}`))

    db.collection('Users')
        .find({name: 'Mariam'})
        .toArray()
        .then(res => console.log(res))
        .catch(err => console.log(err))

    client.close()
})