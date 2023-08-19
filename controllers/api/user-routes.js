const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userDb = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'post_text', 'created_at']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                }
            ]
        });
        if (!userDb) {
            return res.status(404).json({ message: 'There is no user with that ID' });
        }
        return res.json(userDb);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

router.post("/signup", async (req, res) => {
    try {
        console.log('req', req.body)
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
    
        console.log("New User Added!", newUser);
    
        req.session.save(() => {
            req.session.user_id = newUser.user_id;
            req.session.username = newUser.username;
            req.session.email = newUser.email;
            req.session.loggedIn = true;
    
            res.json(newUser);
        });
        } catch (err) {
        res.status(500).json(err);
        }
    });

    router.post('/login', async (req, res) => {
        try {
        console.log("login note");
        const user = await User.findOne({
            where: {
            email: req.body.email,
            },
        });
    
        if (!user) {
            res.status(404).json({ message: 'There is no user with that email address' });
            return;
        }
    
        const rightPassword = user.checkPassword(req.body.password);
    
        if (!rightPassword) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
    
        req.session.user_id = user.id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.loggedIn = true;
    
        req.session.save(() => {
            res.json({ user: user, message: 'Logged in' });
        });
        } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


router.post('/logout', withAuth, async (req, res) => {
    try {
        if (req.session.loggedIn) {
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const userDb = await User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id,
            }
        });
        if (!userDb[0]) {
            res.status(404).json({ message: 'ID does not exist' });
            return;
        }
        const updateduserDb = await User.findByPk(req.params.id);
        res.json(updateduserDb);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const userDb = await User.destroy({
            where: {
                id: req.params.id,
            }
        });

        if (!userDb) {
            res.status(404).json({ message: 'ID does not exist' });
            return;
        }
        res.json(userDb);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;