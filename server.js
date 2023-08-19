const express = require('express');
const session = require('express-session');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

// Set up view engine and static folder
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

// Register custom Handlebars helper
Handlebars.registerHelper('format_plural', (number, singular, plural) => {
    return number === 1 ? `${number} ${singular}` : `${number} ${plural}`;
});

// Session configuration
const sess = {
    secret: 'shh secret',
    cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({ db: sequelize }),
};

// Middleware
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const routes = require('./controllers'); // Import your routes
app.use(routes); // Use your routes

// Database synchronization and server start
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}!`);
    });
});
