import { UserRepository } from '@/repository/user-repository'
import { hash } from 'bcryptjs'
import { log } from 'console'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterRequest) {
    const passwordHash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    })
    
  }
}
