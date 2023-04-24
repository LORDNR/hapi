import { Repository } from 'typeorm'
import { Request, ResponseToolkit } from 'hapi'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { UserEntity } from '../database/entites'
import { initDB } from '../database'


const authController = () => {
    const userRepo: Repository<UserEntity> = initDB.getRepository(UserEntity)
    return [
        {
            method: 'POST',
            path: '/register',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                const { firstName, lastName, email, birthOfDate, password } = request.payload as Partial<UserEntity>
                const hashPassword = bcrypt.hashSync(String(password), await bcrypt.genSalt(10))

                const newUser = userRepo.create({ firstName, lastName, email, birthOfDate, password: hashPassword })
                const savedUser = await userRepo.save(newUser)
                // return h.response({ status: 'success', data: savedUser }).code(201)
                const { password: _, ...user } = savedUser; // Exclude password from the response
                return {
                    ...user,
                    accessToken: sign({ ...user }, 'secret')
                };
            }
        },
    ]
}

export { authController }