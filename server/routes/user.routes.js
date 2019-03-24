const _ = require('lodash');

const express = require('express');
const router = express.Router();

const {
    User
} = require('../models/user');
const {
    authenticate
} = require('../../middleware/authentication');

router.post('/create', async (req, res) => {
    try {
        let body = _.pick(req.body, ['email', 'password']);
        let user = new User(body);

        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        
        res.header('x-auth', token).send(user);
    } catch (error) {
        console.log(error)
        res.status(400).send();
    }
})

router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.delete('/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (error) {
        res.status(400);
    }
})

module.exports = router