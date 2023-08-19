const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth')

//get all posts
router.get('/', async (req, res) => {
    try {
        const postsDb = await Post.findAll({
            attributes: ['id', 'title', 'created_at', 'post_text'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    }
                },
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        });

        const allPosts = postsDb.map(post => post.get({ plain: true }));

        console.log('all posts', allPosts);
        console.log(req.session.loggedIn)
        res.render('homepage', {
            allPosts,
            loggedIn: req.session.loggedIn,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get("/dashboard", withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User }],
            where: {
            user_id: req.session.user_id,
            },
        });
        const posts = postData.map((b) => b.get({ plain: true }));
        const sessionData = {
            isLoggedIn: req.session.loggedIn,
            username: req.session.username,
        };
        console.log("Session Username", sessionData.username);
        console.log("Here are the posts", posts);
        res.render("dashboard", { posts, sessionData });
        } catch (err) {
        res.status(500).json(err);
        }
    });

    //get login page

    router.get("/login", (req, res) => {
        try {
        res.render("login");
        } catch (err) {
        res.status(500).json(err);
        }
    });

    //get signup page

    router.get("/signup", (req, res) => {
        try {
        res.render("signup");
        } catch (err) {
        res.status(500).json(err);
        }
    });

    router.get('/post/:id', async(req, res) => {
        try {
            const postDb = await Post.findByPk(req.params.id, {
            include: [
                User,
                {
                model: Comment,
                include: [User],
                },
            ],
            });
        
            if (postData) {
            // serialize data
            const post = postDb.get({ plain: true });
            res.render('post', { post, loggedIn: req.session.loggedIn });
            } else {
            res.status(404).end();
            }
        } catch (err) {
            res.status(500).json(err);
        }
    });


module.exports = router;
