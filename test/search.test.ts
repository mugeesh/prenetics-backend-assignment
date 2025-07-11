import * as http from 'http';
import { describe, test } from 'mocha';
import { expect } from 'chai';
import { Connection, getRepository } from 'typeorm';
import { Organisation } from '../src/entity/organisation';
import { createExpressApp } from '../src/component/server';
import { initialiseDB, importData } from '../src/component/testConnection';
const supertest = require('supertest');

describe('Search', () => {
    let server:http.Server;
    let connection: Connection
    let organisation: string;
    let url: string;

    before(async () => {
        connection = await initialiseDB();
        await importData()
        const app = createExpressApp();
        server =  http.createServer(app);
        organisation = await (await getRepository(Organisation).findOneOrFail({ where: { name: 'Circle' } })).organisationId;
        url = `/test/v1.0/org/${organisation}/sample`;
    });

    after(() => {
        connection.close();
    });

    test('get all samples under organisation Circle', async () => {
        const response = await supertest(server).get(url);
        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.lengthOf(30);
        expect(response.body.meta.total).to.eql(30);
    });

    test('get 15 results only', async () => {
        const response = await supertest(server).get(`${url}?limit=15`);
        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.lengthOf(15);
        expect(response.body.meta.total).to.eql(30);
    });

    test('search by sampleid', async () => {
        const sampleid = '123456';
        let response = await supertest(server).get(`${url}?sampleid=${sampleid}`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(30);

        response = await supertest(server).get(`${url}?sampleid=12`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(0);
    });

    test('search by patient name', async () => {
        const patientName = 'James Yip';
        let response = await supertest(server).get(`${url}?patientname=${patientName}`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(30);

        response = await supertest(server).get(`${url}?patientname=wrong`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(0);
    });

    test('search by activation date', async () => {
        const activationTime = new Date().toLocaleDateString();
        const yesterday = new Date()
        yesterday.setDate(new Date().getDate() - 1);

        let response = await supertest(server).get(`${url}?activatetime=${activationTime}`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(30);

        response = await supertest(server).get(`${url}?activatetime=wrong`);
        expect(response.status).to.eql(500);

        response = await supertest(server).get(`${url}?activatetime=${yesterday.toLocaleDateString()}`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(0);
    });

    test('search by result time', async () => {
        const resultTime = new Date().toLocaleDateString();
        const yesterday = new Date();
        yesterday.setDate(new Date().getDate() - 1).toLocaleString();

        let response = await supertest(server).get(`${url}?activatetime=${resultTime}`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(30);

        response = await supertest(server).get(`${url}?activatetime=wrong`);
        expect(response.status).to.eql(500);

        response = await supertest(server).get(`${url}?activatetime=${yesterday.toLocaleDateString()}`);
        expect(response.status).to.eql(200);
        expect(response.body.data).to.have.lengthOf(0);
    });

    test('will return extra fields when organisation is Circle', async () => {
        const response = await supertest(server).get(`${url}?limit=1`);
        expect(response.status).to.eql(200);
        expect(response.body.data[0].attributes.type).to.not.be.undefined;
        expect(response.body.data[0].relationships.profile.data.id).to.not.be.undefined;
    });

});
