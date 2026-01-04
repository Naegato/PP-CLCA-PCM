import { User } from '@pp-clca-pcm/domain/entities/user';

export class AdvisorProps {
  public constructor(public readonly clients: User[] = []) {}
}