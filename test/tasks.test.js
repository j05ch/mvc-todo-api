const request = require('supertest');
const app = require('../src/app')({
    storage: "database.test.sqlite"
});
const {Task, TaskList} = require('../src/models');

describe('task API', () => {
    let taskList;
    beforeEach(async () => {
        await global.sequelize.sync({force: true});
        taskList = await TaskList.create({
            title: 'Titel 3'
        });
    });

    describe('POST /task-lists/:taskListId/tasks)', () => {
        it('should post task', async () => {
            await request(app)
                .post(`/task-lists/${taskList.id}/tasks`)
                .send({
                    title: 'Titel Task',
                })
                .expect(201)
                .then(res => {
                    expect(res.body.title).toEqual('Titel Task')
                });

            const task = await Task.findAll();
            expect(task[0].title).toEqual('Titel Task');
            console.log((task[0]), 'TaskListId');
            expect(task[0].taskListId).toEqual(taskList.id);
        });
    });

    describe('GET /task-lists/:taskListId/tasks/:taskId)', () => {
        it('should return 404', async () => {
            await request(app)
                .get(`/task-lists/${taskList.id}/tasks/123`)
                .expect(404)
        });
        it('should return a single task', async () => {
            const task = await taskList.createTask({
                title: "Task title",
                description: "Task title description",
                status: "none"
            });
            await request(app)
                .get(`/task-lists/${taskList.id}/tasks/${task.id}`)
                .expect(200)
        });
    });

    describe('PATCH /task-lists/:taskListId/tasks/:taskId)', () => {
        it('should update a single task', async () => {
            const task = await taskList.createTask({
                title: "Task title",
                description: "Task title description",
                status: "none"
            });
            await request(app)
                .patch(`/task-lists/${taskList.id}/tasks/${task.id}`)
                .send({
                    title: "Title patched"
                })
                .expect(200)
                .then(res => {
                    expect(res.body.title).toEqual('Title patched')
                });

            await task.reload();
            expect(task.title).toEqual('Title patched');
            expect(task.description).toEqual('Task title description');
            expect(task.status).toEqual('none');
        });
        it('should return 404 when asked for non existing taskId', async () => {
            await request(app)
                .patch(`/task-lists/${taskList.id}/tasks/348930284903824`)
                .send({
                    title: "Title patched"
                })
                .expect(404)
        });
    });

    describe('DELETE /task-lists/:taskListId/tasks/:taskId)', () => {
        it('should delete a single task', async () => {
            const task = await taskList.createTask({
                title: "Task title",
                description: "Task title description",
                status: "none"
            });
            await request(app)
                .delete(`/task-lists/${taskList.id}/tasks/${task.id}`)
                .expect(200)
        });
        it('should return 404 when asked for non existing taskId', async () => {
            await request(app)
                .delete(`/task-lists/${taskList.id}/tasks/348930284903824`)
                .expect(404)
        });
    });
});
