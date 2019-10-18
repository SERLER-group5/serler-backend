/**
 * in this file, it would test all the api of the status module
 */
const request = require('supertest');
const hostname = require('../config');
const app = hostname.address;

describe('test all the api about status', () => {

    let allStatus = [];

    before((done) => {
        request(app).get('/api/status')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    allStatus = res.body;
                    console.log('all the status length are: ', allStatus.length);
                    done();
                });
    });

    /**
     * test whether or not it could return all the status information
     */
    it('test query all status api of staus module', (done) => {
        request(app).get('/api/status/')
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                console.info(res.body);
                done();
            });
    });

    /**
     * test the api of querying a status according to the
     * status id
     */
    describe('test query single status api by id', () => {
        let queryId = "";

        /**
         * Firstly, choose the id of the last status object
         * as the query id
         */
        before((done) => {
            if (allStatus.length > 0) {
                queryId = allStatus[allStatus.length - 1]._id;
            }
            done();
        });

        /**
         * test the api of querying a status information 
         * according to the given id
         */
        it('test query api by id of the status module', (done) => {
            request(app).get('/api/status/' + queryId)
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((err, res) => {
                    console.log(res.body);
                    done();
                });
        });
    });

    /**
     * test the api of adding a new status to database
     */
    it('test add api of status module', (done) => {
        // randomly generate a status name
        let __name = 'test_name' + Math.round(Math.random() * 100)
        request(app).post('/api/status/')
            .set('Content-Type', 'application/json')
            .send({ name: __name })
            .expect(200)
            .end((err, res) => {
                // console.log(res.body);
                done();
            });
    });

    /**
     * test the update api of status module
     */
    describe('test update api of status module', () => {
        let updatedId = "";
        before((done) => {
            /**
             * Firstly, query all the status and choose the 
             * last one as the updated target, get its id and 
             * modify its name to 'mocha_test'
             */
            if (allStatus.length > 0) {
                updatedId = allStatus[allStatus.length - 1]._id;
            }
            done();
        })

        /**
        * test the api of updating a status name to specificed status name
        */
        it('test update api of status module', (done) => {
            request(app).put('/api/status/' + updatedId)
                .set('Content-Type', 'application/json')
                .send({ name: 'mocha_test' })
                .expect(200)
                .end((err, res) => {
                    done();
                });
            // console.log('updated id is: ', updatedId);
        });
    });

    /**
     * test delete api of the status module
     */
    describe('test delete api of status moduel', (done) => {
        let deletedId = "";

        /**
         * Firstly, query all the status information, then get the id 
         * of the last one and choose this one as the target deleted object,
         * assign its id to deletedId variable
         */
        before((done) => {
            if (allStatus.length > 0) {
                deletedId = allStatus[allStatus.length - 1]._id;
            }
            done();
        });

        /**
         * delete the last one of all the status
         */
        it('test the delete api of status module', (done) => {
            request(app).delete('/api/status/' + deletedId)
                        .set('Content-Type', 'application/json')
                        .expect(200)
                        .end((err, res) => {
                            done();
                        });
        });
    });
});