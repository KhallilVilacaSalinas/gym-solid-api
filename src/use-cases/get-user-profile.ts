import { UserRepository } from '@/repository/user-repository'
import { User } from '@prisma/client'
import { ItemNotFoundError } from './errors/item-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ItemNotFoundError()
    }

    return {
      user,
    }
  }
}
