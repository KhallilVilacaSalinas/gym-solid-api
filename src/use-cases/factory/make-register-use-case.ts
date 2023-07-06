import { PrismaUserRepository } from '@/repository/prisma/prisma-user-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const userRepository = new PrismaUserRepository()
  const registerUserCase = new RegisterUseCase(userRepository)

  return registerUserCase
}
