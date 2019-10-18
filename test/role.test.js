/**
 * in this file, it would test all the api of the roles module
 */
const request = require('supertest');
const hostname = require('../config');
const app = hostname.address;


/**
 * role api test
 */
describe('test all the api of the roles module', () => {
    let allRoles = [];

    before((done) => {
        request(app).get('/api/roles')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                allRoles = res.body;
                console.log('all the roles length are: ', allRoles.length);
                done();
            });
    });

    /**
     * query all the roles information
     */
    it('test that query all the roles', (done) => {
        request(app).get('/api/roles')
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });

    /**
     * test the api of querying a roles according to the
     * role id
     */
    describe('test query single role api by id', () => {
        let queryId = "";

        /**
         * Firstly, choose the id of the last role object
         * as the query id
         */
        before((done) => {
            if (allRoles.length > 0) {
                queryId = allRoles[allRoles.length - 1]._id;
            }
            done();
        });

        /**
         * test the api of querying a role information 
         * according to the given id
         */
        it('test query api by id of the role module', (done) => {
            request(app).get('/api/roles/' + queryId)
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((err, res) => {
                    console.log('single query successfully..');
                    done();
                });
        });
    });

    /**
     * test the api of adding a new role to database
     */
    it('test add api of role module', (done) => {
        // randomly generate a role name
        let __name = 'testRole' + Math.round(Math.random() * 100)
        request(app).post('/api/roles/')
            .set('Content-Type', 'application/json')
            .send({ name: __name })
            .expect(200)
            .end((err, res) => {
                console.log('Add role successfully...');
                done();
            });
    });

    /**
     * test the update api of role module
     */
    describe('test update api of role module', () => {
        let updatedId = "";
        before((done) => {
            /**
             * Firstly, query all the roles and choose the 
             * last one as the updated target, get its id and 
             * modify its name to 'mocha_role_test'
             */
            if (allRoles.length > 0) {
                updatedId = allRoles[allRoles.length - 1]._id;
            }
            done();
        })

        /**
        * test the api of updating a role name to specificed role name
        */
        it('test update api of role module', (done) => {
            request(app).put('/api/roles/' + updatedId)
                .set('Content-Type', 'application/json')
                .send({ name: 'mocha_role_test' })
                .expect(200)
                .end((err, res) => {
                    console.log('Update role name successfully...');
                    done();
                });
        });
    });

    /**
     * test delete api of the role module
     */
    describe('test delete api of role moduel', (done) => {
        let deletedId = "";

        /**
         * Firstly, query all the roles information, then get the id 
         * of the last one and choose this one as the target deleted object,
         * assign its id to deletedId variable
         */
        before((done) => {
            if (allRoles.length > 0) {
                deletedId = allRoles[allRoles.length - 1]._id;
            }
            done();
        });

        /**
         * delete the last one of all the role
         */
        it('test the delete api of role module', (done) => {
            request(app).delete('/api/roles/' + deletedId)
                        .set('Content-Type', 'application/json')
                        .expect(200)
                        .end((err, res) => {
                            console.log('Delete role successfully...');
                            done();
                        });
        });
    });
});