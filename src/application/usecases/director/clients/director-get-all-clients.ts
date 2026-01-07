import { UserRepository } from "../../../repositories/user.js";

export class DirectorGetAllClients {
	public constructor(
		public userRepository: UserRepository,
  ) {}

	public execute() {
		return this.userRepository.all();
	}
}
