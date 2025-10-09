import { Director } from '@pp-clca-pcm/domain/entities/user/director';

export interface DirectorRepository {
  save(client: Director): Promise<Director>;
}