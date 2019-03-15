const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.post('/users', async (req, res) => {
    try {
        let body = _.pick(req.body, ['email', 'password']);
        let user = new User(body);

        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(404).send();
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = User.findByCredentials(body.email, body.password);
        const token = user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (error) {
        res.status(400).send();
    }
})

router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

router.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (error) {
        res.status(400);
    }
})

module.exports = router