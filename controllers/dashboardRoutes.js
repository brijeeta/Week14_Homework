const router = require('express').Router();
const { Comments, User, Posts } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, (req, res) => {
    Posts.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'contents',
            'title',
            'date_created',
        ],
        include: [
            {
                model: Comments,
                attributes: ['id', 'text', 'post_id', 'user_id', 'date_created'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            console.log(posts);
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Posts.findAll({
        where: {
            // use the ID from the session
            id: req.params.id
        },
        attributes: [
            'id',
            'contents',
            'title',
            'date_created',
        ],
        include: [
            {
                model: Comments,
                attributes: ['id', 'text', 'post_id', 'user_id', 'date_created'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {

            // serialize data before passing to template
            const posts = dbPostData.map(post => {
                return post.get({ plain: true });
            });
            const post = posts[0];
            res.render('editpost', { post, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;