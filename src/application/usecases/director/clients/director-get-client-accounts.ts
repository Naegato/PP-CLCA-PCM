import { User } from "@pp-clca-pcm/domain/entities/user";
import { UserRepository } from "../../../repositories/user.js";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";

export class DirectorGetClientAccounts {
	public constructor(
		private readonly userRepository: UserRepository,
	) {}

	public async execute(client: User): Promise<Error | Account[]> {
		const user = await this.userRepository.find(client);

		if (!user || !user.isClient()) {
			return new Error();
		}

		return Promise.resolve(user.clientProps?.accounts ?? []);
	}
}
