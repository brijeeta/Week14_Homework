
const router = require('express').Router();
const { Posts, Comments, User } = require('../../models');
const withAuth = require('../../utils/auth');

// create new blog post
router.post('/', withAuth, (req, res) => {
    Posts.create({
        title: req.body.title,
        contents: req.body.contents,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// put api to edit the post
router.put('/:id', withAuth, (req, res) => {
    Posts.update(
        {
            title: req.body.title,
            contents: req.body.contents
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete Api to delete post

router.delete('/:id', withAuth, (req, res) => {
    Posts.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'contents',
            'title',
            'date_created',
        ],
        include: [
            // include the Comment model here:
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
        .then(post => {
            if (post.comments.length > 0) {
                Comments.destroy({
                    where: {
                        post_id: req.params.id
                    }
                })
                    .then(response => {
                        if (!response) {
                            res.status(404).json({ message: 'No post found with this id' });
                            return;
                        }
                        Posts.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(dbPostData => {
                                if (!dbPostData) {
                                    res.status(404).json({ message: 'No post found with this id' });
                                    return;
                                }
                                res.json(dbPostData);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json(err);
                            });
                    });
            } else {
                Posts.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(dbPostData => {
                        if (!dbPostData) {
                            res.status(404).json({ message: 'No post found with this id' });
                            return;
                        }
                        res.json(dbPostData);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                    });
            }
        })
});

// get all users
router.get('/', (req, res) => {
    Posts.findAll({
        order: [['date_created', 'DESC']],
        attributes: [
            'id',
            'contents',
            'title',
            'date_created',
        ],
        include: [
            // include the Comment model here:
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
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    Posts.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'contents',
            'title',
            'date_created',
        ],
        include: [
            // include the Comment model here:
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
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});



module.exports = router;