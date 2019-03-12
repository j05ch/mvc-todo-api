const {Router} = require("express");
const controller = Router();
const {TaskList} = require('../models');

module.exports = controller;

controller.get('/task-lists', async function (req, res) {
    const taskLists = await TaskList.findAll();
    res.json(taskLists);
});

controller.post('/task-lists', async function(req, res) {
    const taskList = await TaskList.create(req.body, { fields: [ 'title' ] });
    res.status(201).json(taskList);
});
