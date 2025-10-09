import { Advisor } from '@pp-clca-pcm/domain/entities/user/advisor';
import { AdvisorRepository } from '../../../repositories/advisor';
import { exhaustive } from 'exhaustive';
import { AdvisorCreateError } from '../../../errors/advisor-create';

export class AdvisorRegistration {
  public constructor (
    public readonly advisorRepository: AdvisorRepository,
  ) { }

  public async execute (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<Advisor | AdvisorCreateError> {
    const advisor = Advisor.create(firstname, lastname, email, password);

    if (advisor instanceof Error) {
      return new AdvisorCreateError(advisor);
    }

    const savedAdvisor = await this.advisorRepository.save(advisor);
    return savedAdvisor;
  }
}