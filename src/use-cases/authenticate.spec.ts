import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let userRepository: InMemoryUserRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    authenticateUseCase = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
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
    await expect(() =>
      authenticateUseCase.execute({
        email: 'johndue@gmail.com',
        password: '1234556',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
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
