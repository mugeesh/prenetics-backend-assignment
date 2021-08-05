import 'express-validator';
import 'reflect-metadata';
import { initialiseDb } from './component/db';
import { createHttpServer } from './route';

initialiseDb().then(() => {
    createHttpServer();
});
