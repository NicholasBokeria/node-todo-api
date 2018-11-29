const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true)

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

UserSchema.statics.findByToken = function (token) {
    let User = this
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123')
    } catch (error) {
        return Promise.reject()
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}
// UserSchema.statics.findByToken = function (token) {
//     var User = this;
//     var decoded;

//     try {
//       decoded = jwt.verify(token, 'abc123');
//     } catch (e) {
//       return Promise.reject();
//     }

//     return User.findOne({
//       '_id': decoded._id,
//       'tokens.token': token,
//       'tokens.access': 'auth'
//     });
//   };

let User = mongoose.model('User', UserSchema)

module.exports = { User }