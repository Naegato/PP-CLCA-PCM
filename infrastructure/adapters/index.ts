import { Database } from './infrastructure/adapters/repositories/mariadb/database';
import { MariadbDiscussionRepository } from './infrastructure/adapters/repositories/mariadb/discussion/discussion';

const dtb = new Database();
const repo = new MariadbDiscussionRepository(dtb);

const object = await repo.get('1');

console.log(object);
