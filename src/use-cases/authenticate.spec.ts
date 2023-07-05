import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'John Due',
      email: 'johndue@gmail.com',
      password: await hash('1234556', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'johndue@gmail.com',
      password: '1234556',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    await expect(() =>
      authenticateUseCase.execute({
        email: 'johndue@gmail.com',
        password: '1234556',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'John Due',
      email: 'johndue@gmail.com',
      password: await hash('1234556', 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'johndue@gmail.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
