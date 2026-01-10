import { Security } from "@pp-clca-pcm/application/services/security";
import { TokenService } from "@pp-clca-pcm/application/services/token";
import { UserRepository } from "@pp-clca-pcm/application/repositories/user";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { UserNotFoundByIdError } from "@pp-clca-pcm/application/errors/user-not-found-by-id";

export class JwtSecurityService implements Security {
    private currentUser: User | null = null;

    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository,
    ) {}

    public async authenticate(token: string): Promise<boolean> {
        const userId = await this.tokenService.verify(token);
        if (!userId) {
            this.currentUser = null;
            return false;
        }

        const user = await this.userRepository.findById(userId);
        if (user instanceof UserNotFoundByIdError) {
            this.currentUser = null;
            return false;
        }

        this.currentUser = user;
        return true;
    }

    public getCurrentUser(): Promise<User | null>{
        return Promise.resolve(this.currentUser);
    }
}
