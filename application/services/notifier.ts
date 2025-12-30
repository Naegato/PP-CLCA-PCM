import { User } from "@pp-clca-pcm/domain/entities/user";

export interface Notifier {
	notifierAllUsers(message: string): Promise<void>;
	notiferUser(user: User, message: string): Promise<void>;
}
