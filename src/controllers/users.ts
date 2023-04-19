import { Repository } from 'typeorm'
import { Request, ResponseToolkit } from 'hapi'
import bcrypt from 'bcryptjs'

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
                const sanitizedUsers = users.map((userData: UserEntity) => ({ ...userData, password: undefined }));
                return h.response({
                    status: 'success',
                    data: sanitizedUsers,
                }).code(200);
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
                const { password, ...userData } = user;
                return h.response({ status: 'success', data: userData }).code(200);
            }
        },
        {
            method: 'POST',
            path: '/users',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                const { firstName, lastName, email, birthOfDate, password } = request.payload as Partial<UserEntity>
                const hashPassword = bcrypt.hashSync(String(password), await bcrypt.genSalt(10))

                const newUser = userRepo.create({ firstName, lastName, email, birthOfDate, password: hashPassword })
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
                const { password, ...userData } = updatedUser;
                return h.response({ status: 'success', data: userData }).code(200);
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