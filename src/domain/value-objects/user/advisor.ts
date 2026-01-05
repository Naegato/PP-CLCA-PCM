import { User } from '../../entities/user';

export class AdvisorProps {
  public constructor(public readonly clients: User[] = []) {}
}