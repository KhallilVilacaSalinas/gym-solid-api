import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Due',
      email: 'johndue@gmail.com',
      password: '1234556',
    })

    const isPasswordCorrectlyHashed = await compare('1234556', user.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be acle to register with same emaul twice', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'johndue@gmail.com'

    await registerUseCase.execute({
      name: 'John Due',
      email,
      password: '1234556',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Due',
        email,
        password: '1234556',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be ableto register', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Due',
      email: 'johndue@gmail.com',
      password: '1234556',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
