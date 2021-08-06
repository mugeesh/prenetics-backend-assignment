import { Request, Response } from 'express';
import { SWAGGER } from '../component/constant';

export const swaggerController = new class {

    getSwagger = async (request: Request, response: Response) => {
        return SWAGGER;
    }

};
