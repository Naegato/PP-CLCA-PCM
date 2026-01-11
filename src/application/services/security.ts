import { User } from "@pp-clca-pcm/domain/entities/user";

export interface Security {
  getCurrentUser(): Promise<User | null>;
}
