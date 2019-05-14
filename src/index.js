const app = require('./app')({dbUrl: process.env.DATABASE_URL});

const port = process.env.PORT || 3000;
// Paramater Objekt sync ({force: true})
global.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`MVC app listening on port ${port}!`);
    })
});
