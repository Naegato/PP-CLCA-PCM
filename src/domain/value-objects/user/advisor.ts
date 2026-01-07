import { User } from '../../entities/user.js';

export class AdvisorProps {
  public constructor(public readonly clients: User[] = []) {}
}