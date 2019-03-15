const _ = require('lodash');

const express = require('express');
const router = express.Router();

const {
    ObjectID
} = require('mongodb');
const {
    Post
} = require('../models/post');
const {
    authenticate
} = require('../../middleware/authentication');

router.post('/create', authenticate, (req, res) => {
    const post = new Post({
        title: req.body.title,
        _creator: req.user._id
    });

    post.save()
        .then(doc => res.send(doc))
        .catch(err => res.send(err));
});

router.get('/posts', authenticate, (req, res) => {
    Posts.find({
            _creator: req.user._id
        })
        .then(posts => {
            res.send({
                posts
            })
        })
        .catch(err => res.send(err));
});

router.get('/post/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Post.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        
        if (!todo) return res.status(404).send();

        res.send({
            todo
        });

    }).catch((e) => {
        res.status(400).send();
    });
});

router.delete('/post/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        const post = await Post.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        })

        if (!post) {
            throw new Error(res.status(404).send())
        }

        res.send(post)
    } catch (e) {
        console.log(e)
    }
});

router.patch('/post/:id', authenticate, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['title'])

    if (!ObjectID.isValid(id)) res.send(404)

    Post.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
            $set: body
        }, {
            new: true
        })
        .then(post => {
            if (!post) res.status(404).send()

            res.send({
                post
            })
        })
        .catch(err => res.send(404));
});

module.exports = router