import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-user-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ItemNotFoundError } from './errors/item-not-found-error'

let userRepository: InMemoryUserRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'John Due',
      email: 'johndue@gmail.com',
      password: await hash('1234556', 6),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Due')
  })

  it('should be able to get user profile with wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ItemNotFoundError)
  })
})
