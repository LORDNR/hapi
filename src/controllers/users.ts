import { Repository } from 'typeorm'
import { Request, ResponseToolkit } from 'hapi'

import { UserEntity } from '../database/entites'
import { initDB } from '../database'


const userController = () => {
    const userRepo: Repository<UserEntity> = initDB.getRepository(UserEntity)
    return [
        {
            method: 'GET',
            path: '/users',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                const users = await userRepo.find();
                return users;
            }
        },
        {
            method: 'GET',
            path: '/users/{id}',
            handler: async ({ params: { id } }: Request, h: ResponseToolkit, err?: Error) => {
                const user = await userRepo.findOne({ where: { id } });
                return user;
            }
        },
    ]
}

export { userController }