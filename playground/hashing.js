const { SHA256 } = require('crypto-js')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = '123abc'

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log('hash',hash)
    })
})

let hashedPassword = '$2a$10$8iAuovPb.Vb9lAPTTGhUcu43.8a8kTWZ9ilN.rUt66xuvUlfkPXCO'

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log('solved',res)
})

// let data = {
//     id: 10
// }

// let token = JWT.sign(data, '123abc')
// console.log(token)

// let decoded = JWT.verify(token, '123abc')
// console.log(decoded)
// let message = 'HAHA'
// let hash = SHA256(message).toString()

// console.log(message,'\n',hash)

// let data = {
//     id: 4
// }

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash= SHA256(JSON.stringify(token.data)).toString()

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if(resultHash == token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log('Data was changed, Do not trust')
// }