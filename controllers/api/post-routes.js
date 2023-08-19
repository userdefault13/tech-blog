const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

//Route getting requests on root url - when request is received the handler function executes a db query to retrieve posts
router.get('/', async (req, res) => {
    try {
        const postDb = await Post.findAll({
            attributes: ['id', 'post_text', 'title', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: 'username',
                    }
                },
                {
                    model: User,
                    attributes: 'username',
                },
            ]
        })
        //results returned in JSON format
        res.json(postDb)
    } catch (err) {
        res.status(500).json(err);
    };
});

//get a single row from the post table that matches the specified ID
router.get('/:id', async (req, res) => {
    try {
        const postDb = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'post_text', 'title', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attribute: 'username',
                    }
                },
                {
                    model: User,
                    attributes: 'username',
                },
            ]
        })
        res.json(postDb);
        // if the post with the ID is found, result shown 
        if (!postDb) {
            res.status(404).json({ message: 'ID does not exist' });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const postDb = await Post.create({
            title: req.body.title,
            post_text: req.body.post_text,
            user_id: req.session.user_id,
        })
        res.json(postDb)
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const postDb = Post.update(
            {
                title: req.body.title,
                post_text: req.body.post_text,
            },
            {
                where: {
                    id: req.params.id,
                }
            }
        )
        res.json(postDb)
        if (!postDb) {
            res.status(404).json({ message: 'ID does not exist' });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        console.log('id', req.params.id);
        const postDb = await Post.destroy({
            where: {
                id: req.params.id,
            }
        })
        res.json(postDb)
        if (!postDb) {
            res.status(404).json({ message: 'ID does not exist' });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;