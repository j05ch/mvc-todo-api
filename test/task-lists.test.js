const request = require('supertest');
const app = require('../src/app')({
    storage: "database.test.sqlite"
});
const {TaskList} = require('../src/models');

describe('task- lists API', () => {
    beforeEach(() => global.sequelize.sync({force: true}));


    describe('GET /task-lists', () => {
        it('should return empty array', () =>
            request(app)
                .get('/task-lists')
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual([])
                })
        )
        ;

        it('should return task-list', async () => {
            await TaskList.create({title: 'Titel'});
            await request(app)
                .get('/task-lists')
                .expect(200)
                .then(res => {
                    expect(res.body).toHaveLength
                    expect(res.body[0]).toHaveProperty('createdAt')
                    expect(res.body[0]).toHaveProperty('id')
                    expect(res.body[0]).toHaveProperty('title', 'Titel')
                    expect(res.body[0]).toHaveProperty('updatedAt')
                })
        });
    })
    describe('POST /task-lists)', () => {
        it('should post task', async () => {
            await request(app)
                .post('/task-lists')
                .send({title: 'Titel 2'})
                .expect(201)
                .then(res => {
                    expect(res.body.title).toEqual('Titel 2')
                })

            const taskLists = await TaskList.findAll();
            expect(taskLists[0].title).toEqual('Titel 2');
        })
    })
});
