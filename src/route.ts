import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import { APPLICATION_NAME, PORT } from './component/constant';
import { logger } from './component/logger';
import { testController } from './controller/testcontroller';
import * as expressValidator from 'express-validator';

const versionPath = `/${APPLICATION_NAME}/v1.0`;
const routes = [
    {
        method: 'get',
        route: `${versionPath}/test/:testId`,
        main: testController.get,
    },
    {
        method: 'post',
        route: `${versionPath}/test`,
        main: testController.create,
    }
];

export function createHttpServer() {
    const app = express();
    app.use(bodyParser.urlencoded({ limit: 100000, extended: false }));
    app.use(bodyParser.json({ limit: 100000 }));
    app.use(expressValidator());
    routes.forEach(r => {
        const { method, route, main, } = r;
        logger.info(`Adding ${method} ${route}`);
        const handler = async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
            try {
                const result = main(req, res);
                if (result instanceof Promise) {
                    const response = await result;
                    res.send(response);
                } else {
                    res.json(result);
                }
            } catch (err) {
                logger.error(err);
                if (err.statusCode === 400) {
                    res.status(400);
                    res.json({ code : 400, msg: err.message, });
                } else {
                    res.status(500);
                    res.json({ code: 500, msg: err.message, });
                }
            }
        };
        switch (method) {
            case 'put':
                app.put(route, handler);
                break;
            case 'post':
                app.post(route, handler);
                break;
            case 'delete':
                app.delete(route, handler);
                break;
            case 'patch':
                app.patch(route, handler);
                break;
            case 'get':
                app.get(route, handler);
                break;
        }
    });
    const server = http.createServer(app);
    server.listen(PORT);
    logger.info(`${APPLICATION_NAME} is running on http://localhost:${PORT}`);
}
