const router = require('express').Router();
const { User, Posts } = require('../models');
const withAuth = require('../utils/auth');

// TODO: Add a comment describing the functionality of the withAuth middleware
router.get('/', withAuth, async(req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [
                ['username', 'ASC']
            ],
        });

        const users = userData.map((project) => project.get({ plain: true }));

        res.render('home', {
            users,
            // TODO: Add a comment describing the functionality of this property
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/dashboard', withAuth, async(req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

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

router.get('/posts/:id', async(req, res) => {
    try {
        const postData = await Posts.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['username'],
            }, ],
        });

        const singlePost = postData.get({ plain: true });

        res.render('singlePost', {
            ...singlePost,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// render All posts handlebar
router.get('/allPosts', withAuth, async(req, res) => {
    try {
        // Get all projects and JOIN with user data
        const postsData = await Posts.findAll({
            include: [{
                model: User,
                attributes: ['username'],
            }, ],
        });

        // Serialize data so the template can read it
        const posts = postsData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('home', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;