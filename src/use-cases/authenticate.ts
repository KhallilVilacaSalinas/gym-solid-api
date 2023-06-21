import { UserRepository } from "@/repository/user-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateUseCaseRequest {
    email: string,
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(
        private userRepository: UserRepository
    ) {}

    async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user =  await this.userRepository.findByEmail(email);

        if(!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatches = await compare(password, user.password);

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError();
        }

        return {
            user
        }
    }
}