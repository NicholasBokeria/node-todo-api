const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    tokens: [{
        access: {
            type: String,
            required: false
        },
        token: {
            type: String,
            required: false
        }
    }]
})

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth'
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

    user.tokens = user.tokens.concat([{ access, token }])

    return user.save()
        .then(() => token)
}

let User = mongoose.model('User', UserSchema)

module.exports = { User }