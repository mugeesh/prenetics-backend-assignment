import * as express from 'express';
import * as expressValidator from 'express-validator';
import * as http from 'http';
import { routes } from '../route';
import { APPLICATION_NAME, PORT } from './constant';
import { logger } from './logger';
import * as cors from 'cors';

// In your server setup file
function getCorsOptions() {
    return {
        origin: [
            'http://localhost:9080',  // Swagger UI on host
            'http://test:9080',      // Swagger UI in Docker network
            /^http:\/\/localhost(:\d+)?$/,  // Any localhost port
            /^http:\/\/test(:\d+)?$/       // Any test port
        ],
        credentials: true,
        allowedHeaders: ['*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    };
}

export function createExpressApp() {
    const app = express();

    // Enhanced CORS configuration
    app.use(cors(getCorsOptions()));
    app.use(express.urlencoded({limit: 100000, extended: false}));
    app.use(express.json({limit: 100000}));
    app.use(expressValidator());
    // request validation middleware
    app.use(((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', `Origin,Accept,Content-Type,X-Owner,X-Requested-With,X-XSRF-Token,X-Access-Token,Authorization,Cache-Control,Expires`);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Max-Age', '3600');
        res.header('Access-Control-Allow-Credentials', 'true');
        console.log(1);
        next();
    }));
    routes.forEach(r => {
        const {method, route, main } = r;
        logger.info(`Adding ${method} ${route}`);
        const handler = async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
            try {
                const result = main(req, res);
                if (result instanceof Promise) {
                    await result;
                } else {
                    res.json(result);
                }
            } catch (err) {
                logger.error(err);
                if (err.statusCode === 400) {
                    res.status(400);
                    res.json({code: 400, msg: err.message });
                } else {
                    res.status(500);
                    res.json({code: 500, msg: err.message });
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
    return app;
}
export function createHttpServer() {
    const app = createExpressApp();
    const server = http.createServer(app);
    server.listen(PORT);
    logger.info(`${APPLICATION_NAME} is running on http://localhost:${PORT}`);
}

