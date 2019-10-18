/**
 * in this file, it would test all the api of the article module
 */
const request = require('supertest');
const hostname = require('../config');
const app = hostname.address;

describe('test all the api of the article module', () => {
    let allArticles = [];
    let allStatus = [];
    let allUsers = [];
    const ContentType = 'Content-Type';
    const ApplicationJson = 'application/json';

    /**
     * query all the articles used for the test after it
     */
    before((done) => {
        request(app).get('/api/users')
            .set(ContentType, ApplicationJson)
            .end((err, res) => {
                allUsers = res.body;
            });

        request(app).get('/api/status')
            .set(ContentType, ApplicationJson)
            .end((err, res) => {
                allStatus = res.body;
            });

        request(app).get('/api/articles')
            .set(ContentType, ApplicationJson)
            .expect(200)
            .end((err, res) => {
                allArticles = res.body;
            });

        done();
    });

    /**
     * query all the articles
     */
    it('test the api of querying all the articles', (done) => {
        request(app).get('/api/articles')
            .set(ContentType, ApplicationJson)
            .expect(200)
            .end((err, res) => {
                done();
            });
    });

    /**
     * query the specific article according to given article id
     */
    describe('query single article by article id', () => {
        let queryId = "";

        /**
         * choose the last article of all the query articles 
         * as the target query object, and assign its id to
         * queryId variable
         */
        before((done) => {
            if (allArticles.length > 0) {
                queryId = allArticles[allArticles.length - 1]._id
            }
            done();
        });

        /**
         * query article by id
         */
        it('test querying single article by id', (done) => {
            request(app).get('/api/articles/' + queryId)
                .set(ContentType, ApplicationJson)
                .expect(200)
                .end((err, res) => {
                    done();
                });
        });
    });

    /**
     * add a new article
     */
    describe('add a new article', () => {

        let status = "";
        let submitterId = "";

        /**
         * do some initial job for adding a new article
         */
        before((done) => {
            /**
             * firstly, randomly query a status id as the status of the article
             * to be added
             */
            if (allStatus.length > 0) {
                let index = Math.round(Math.random() * (allStatus.length - 1));
                status = allStatus[index]._id;
            }
            /**
             * firstly, randomly query a user id as the submitter of the article
             * to be added
             */
            if (allUsers.length > 0) {
                let index = Math.round(Math.random() * (allUsers.length - 1));
                submitter = allUsers[index]._id;
            }

            done();
        });

        /**
         * add a new article
         */
        it('test add api of article module', (done) => {
            let randomNum = Math.round(Math.random() * 100);
            request(app).post('/api/articles')
                .set(ContentType, ApplicationJson)
                .send({
                    title: "test title" + randomNum,
                    tags: "test tags" + randomNum,
                    content: "this is test content" + randomNum,
                    status: status,
                    submitter: submitter
                }).expect(200)
                .end((err, res) => {
                    done();
                });
            console.log('submitter: ', submitter);
            console.log('status: ', status);
        });
    });

    /**
     * condition query
     */
    it('test the condition query api of the article module', (done) => {
        let randomNum = Math.round(Math.random() * 100);
        request(app).post('/api/article/condition/query')
            .set(ContentType, ApplicationJson)
            .send({ title: 'test title' + randomNum, tags: 'test tags' + randomNum })
            .expect(200)
            .end((err, res) => {
                console.log(res.body);
                done();
            });
    });

    /**
     * update api test
     */
    describe('update api test of article module', () => {
        let updatedId = "";
        /**
         * choose the last one as the target updated object,
         * and choose its article id as updated id
         */
        before((done) => {
            if (allArticles.length > 0) {
                updatedId = allArticles[allArticles.length - 1]._id;
            }
            done();
        });

        /**
         * test delete api
         */
        it('delete api test', (done) => {
            let randomNum = Math.round(Math.random() * 50);
            request(app).put('/api/articles/' + updatedId)
                        .set(ContentType, ApplicationJson)
                        .send(
                            {
                                title: 'update title' + randomNum, 
                                content: 'updated content' + randomNum,
                                tags: 'updated tags' + randomNum
                            }
                        )
                        .expect(200)
                        .end((err, res) => {
                            console.log('updated successfully...');
                            done();
                        });
        });
    });

    /**
     * delete api test
     */
    describe('delete api test of article module', () => {
        let deleteId = "";
        /**
         * choose the last one as the target deleted object,
         * and choose its article id as deleted id
         */
        before((done) => {
            if (allArticles.length > 0) {
                deleteId = allArticles[allArticles.length - 1]._id;
            }
            done();
        });

        /**
         * test delete api
         */
        it('delete api test', (done) => {
            request(app).delete('/api/articles/' + deleteId)
                        .set(ContentType, ApplicationJson)
                        .expect(200)
                        .end((err, res) => {
                            console.log('deleted successfully...');
                            done();
                        });
        });
    });
});