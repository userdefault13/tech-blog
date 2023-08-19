const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Database synchronization and server start
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}!`);
    });
});
