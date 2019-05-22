const {Router} = require("express");
const controller = Router();
const {Task, TaskList} = require("../models");

controller.get('/task-lists/:taskListId/tasks', async function (req, res) {
    const taskList = await TaskList.findOne({
        where: {id: req.params.taskListId},
        include: [Task]
    });
    res.json(taskList.tasks);
});

controller.post('/task-lists/:taskListId/tasks', async function (req, res) {
    const taskList = await TaskList.findOne({
        where: {id: req.params.taskListId}
    });
    const task = await taskList.createTask(req.body, {fields: ['title', 'description', 'status']});
    res.status(201).json(task);
});

controller.get("/task-lists/:taskListId/tasks/:taskId", async (req, res) => {
    const task = await Task.findOne({
        where: {
            id: req.params.taskId,
            taskListId: req.params.taskListId
        }
    });
    if (task)
        res.status(200).json(task);
    else
        res.sendStatus(404);
});

controller.patch('/task-lists/:taskListId/tasks/:taskId', async function (req, res) {
    const task = await Task.findOne({
        where: {
            id: req.params.taskId,
            taskListId: req.params.taskListId
        }
    });
    if (task) {
        await task.update(req.body, {fields: ['title', 'description', 'status']});
        res.status(200).json(task);
    } else
        res.sendStatus(404);
});

controller.delete('/task-lists/:taskListId/tasks/:taskId', async function (req, res) {
    const task = await Task.findOne({
        where: {
            id: req.params.taskId,
            taskListId: req.params.taskListId
        }
    });
    if (task) {
        await task.destroy();
        res.status(200).json(task);
    } else
        res.sendStatus(404);
});

module.exports = controller;
