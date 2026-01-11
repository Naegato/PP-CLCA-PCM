import { User } from '@pp-clca-pcm/domain';

export interface Security {
  getCurrentUser(): Promise<User | null>;
}
