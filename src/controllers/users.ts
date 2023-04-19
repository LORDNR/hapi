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
                const options = { where: { ...request.query } }

                const users = await userRepo.find(options);
                return h.response({ status: 'success', data: users }).code(200);
            }
        },
        {
            method: 'GET',
            path: '/users/{id}',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                const id = request.params
                const user = await userRepo.findOne({ where: id });
                if (!user) {
                    return h.response({ status: 'error', data: 'This user information does not exist.' }).code(400);
                }
                return h.response({ status: 'success', data: user }).code(200);
            }
        },
        {
            method: 'POST',
            path: '/users',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                const { firstName, lastName, email, birthOfDate } = request.payload as Partial<UserEntity>
                const newUser = userRepo.create({ firstName, lastName, email, birthOfDate })
                const savedUser = await userRepo.save(newUser)
                return h.response({ status: 'success', data: savedUser }).code(201)
            }
        },
        {
            method: 'PATCH',
            path: '/users/{id}',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                const id = request.params
                const userToUpdate = await userRepo.findOne({ where: id });

                if (!userToUpdate) {
                    return h.response({ status: 'error', data: 'This user information does not exist.' }).code(400);
                }

                const { firstName, lastName, birthOfDate, email } = request.payload as Partial<UserEntity>;
                userToUpdate.firstName = firstName ?? userToUpdate.firstName;
                userToUpdate.lastName = lastName ?? userToUpdate.lastName;
                userToUpdate.birthOfDate = birthOfDate ?? userToUpdate.birthOfDate;
                userToUpdate.email = email ?? userToUpdate.email;

                const updatedUser = await userRepo.save(userToUpdate);
                return h.response({ status: 'success', data: updatedUser }).code(200);
            }
        },
        {
            method: 'DELETE',
            path: '/users/{id}',
            handler: async (request: Request, h: ResponseToolkit) => {
                const id = request.params;
                const userToDelete = await userRepo.findOne({ where: id });

                if (!userToDelete) {
                    return h.response({ status: 'error', data: 'This user information does not exist.' }).code(400);
                }

                await userRepo.delete(id);
                return h.response().code(204);
            }
        }
    ]
}

export { userController }