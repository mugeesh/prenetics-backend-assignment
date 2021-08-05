import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { logger } from '../component/logger';
import { Test as TestType } from '../component/type';
import { Test } from '../entity/test';

export const testController = new class {

    get = async (request: Request, response: Response) => {
        request.checkParams('testId', 'testId is not valid').isUUID();
        const errors = request.validationErrors();
        if (errors) {
            response.status(400).json(errors);
            return;
        }

        const testId: string = request.params.testId;
        try {
            const value = await getRepository(Test).findOne({ testId: testId, });
            if (value) {
                response.status(200).json(value);
            } else {
                response.status(404).json({ msg: 'Not found' });
            }
        } catch (err) {
            logger.error(err.message);
            response.status(500).json({ msg: 'Something went wrong' });
        }
    }

    create = async (request: Request, response: Response) => {
        request.checkBody('name', 'name is not valid').notEmpty();
        request.checkBody('value', 'value is not valid').exists();
        request.checkBody('user', 'user is not valid').isString().notEmpty();
        request.checkBody('comment', 'value is not valid').optional().notEmpty();
        const errors = request.validationErrors();
        if (errors) {
            response.status(400).json(errors);
            return;
        }

        try {
            const test: TestType = request.body;
            const value = getRepository(Test).create(test);
            const entity = await getRepository(Test).save(value);
            response.status(201).json(entity);
        } catch (err) {
            logger.error(err.message);
            response.status(500).json({ msg: 'Something went wrong' });
        }
    }

};
