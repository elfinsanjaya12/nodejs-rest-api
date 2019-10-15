var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require('supertest');
var server = require('../src/app');

describe('User API Tests', () => {
    it('POST /users/ create new user', async () => {
        const user = {
            name: 'Ahmad rosid',
            email: 'alahmadrosid@gmail.com',
            password: '123456'
        };
        const response = await request(server).post('/users').send(user);
        expect(response.statusCode).to.equal(201)
        expect(response.body).to.be.an.instanceof(Object);
        expect(response.body).to.include.keys(['token', 'user']);
        expect(response.body.user).to.include({
            name: 'Ahmad rosid',
            email: 'alahmadrosid@gmail.com',
        });
    })

    it('POST /users/ create new user validation', async () => {
        const response = await request(server).post('/users').send({});
        expect(response.statusCode).to.equal(422)
    })

    it('POST /users/login success login', async () => {
        const response = await request(server).post('/users/login').send({
            email: 'alahmadrosid@gmail.com',
            password: '123456'
        });
        expect(response.statusCode).to.equal(200);
        expect(response.body.user).to.include({
            email: 'alahmadrosid@gmail.com'
        });
    })

    it('POST /users/login invalid login credentials', async () => {
        const response = await request(server).post('/users/login').send({
            email: 'alahmadrosid@gmail.com',
            password: 'xxx'
        });
        expect(response.statusCode).to.equal(401)
        expect(response.body.error).to.equal('Login failed! Check authentication credentials')
    })

})


//run once after all tests
after(function (done) {
    var mongoose = require('mongoose');
    console.log('Deleting test database');
    mongoose.connection.db.dropDatabase(done);
});