import { User } from '@pp-clca-pcm/domain';

export interface Notifier {
	notifierAllUsers(message: string): Promise<void>;
	notiferUser(user: User, message: string): Promise<void>;
}
