const router = require('express').Router();
const { Comments, User, Posts } = require('../models');


// get all post data
router.get('/', (req, res) => {
    Posts.findAll({
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
            // pass a single post object into the homepage template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            console.log(posts);
            res.render('home', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get single post data

router.get('/post/:id', (req, res) => {
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

            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to template
            res.render('singlepost', {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// router.get('/dashboard', withAuth, async (req, res) => {
//     try {
//         const userData = await User.findByPk(req.session.user_id, {
//             attributes: { exclude: ['password'] },
//         });

//         const user = userData.get({ plain: true });

//         res.render('dashboard', {
//             ...user,
//             logged_in: req.session.logged_in
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

router.get('/login', (req, res) => {
    // TODO: Add a comment describing the functionality of this if statement
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    // TODO: Add a comment describing the functionality of this if statement
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

// render single post handlebar

// router.get('/posts/:id', withAuth, async (req, res) => {
//     try {
//         const postData = await Posts.findByPk(req.params.id, {
//             include: [{
//                 model: User,
//                 attributes: ['username'],
//             },],
//         });

//         const singlePost = postData.get({ plain: true });

//         res.render('singlepost', {
//             ...singlePost,
//             logged_in: req.session.logged_in
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // render newpost handlebar
// router.get('/newpost', async (req, res) => {
//     try {
//         res.render('newpost', {
//             logged_in: req.session.logged_in
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// })

// render All posts handlebar
// router.get('/allPosts', withAuth, async (req, res) => {
//     try {
//         // Get all projects and JOIN with user data
//         const postsData = await Posts.findAll({
//             include: [{
//                 model: User,
//                 attributes: ['username'],
//             },],
//         });

//         // Serialize data so the template can read it
//         const posts = postsData.map((post) => post.get({ plain: true }));

//         // Pass serialized data and session flag into template
//         res.render('home', {
//             posts,
//             logged_in: req.session.logged_in
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// })

module.exports = router;