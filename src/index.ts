import Hapi from '@hapi/hapi'
import { Request, ResponseToolkit } from 'hapi'

import { initDB } from './database';
import configs from './configs';

const init = async () => {
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

    await initDB().then(() =>
        console.log('connection database successfully')
    )

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();