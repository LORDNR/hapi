import Hapi from '@hapi/hapi'
import { Request, ResponseToolkit } from 'hapi'

import { initDB } from './database';
import configs from './configs';
import { authController, userController } from './controllers'

const init = async () => {
    await initDB.initialize()

    const server: Hapi.Server = Hapi.server({
        port: configs.environments.PORT,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Request, h: ResponseToolkit, err?: Error) => {
            return { message: 'Hello world' };
        }
    });

    server.route(userController())
    server.route(authController())

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();