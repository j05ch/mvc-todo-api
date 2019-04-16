const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const requireAll = require("require-dir-all");
const Sequelize = require('sequelize');
const cors = require('cors');

module.exports = ({storage = "database.sqlite"} = {}) => {
    app.use(bodyParser.json());
    app.use(cors());

    app.use(morgan("dev"));

    global.sequelize = new Sequelize(null, null, null, {
        dialect: "sqlite",
        storage
    });

    Object.values(requireAll("./controllers")).forEach(c => app.use(c));

    return app;
};

// wenn node env = test ':memory:'
