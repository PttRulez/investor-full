import { Opinion } from 'src/opinion/opinion.model';
import { PrismaExpert, PrismaExpertWithRelations } from './types';
import { IExpertResponse } from 'contracts';
export class Expert {
  avatarUrl: string | null;
  id: number;
  name: string;
  opinions: Array<Opinion>;
  userId: number;

  constructor(expert: PrismaExpert);
  constructor(expert: PrismaExpertWithRelations) {
    this.avatarUrl = expert.avatarUrl;
    this.id = expert.id;
    this.name = expert.name;
    this.opinions = expert.opinions?.map(o => new Opinion(o)) ?? [];
    this.userId = expert.userId;
  }

  toJSON(): IExpertResponse {
    return {
      avatarUrl: this.avatarUrl,
      id: this.id,
      name: this.name,
      opinions: this.opinions.map(o => o.toJSON()),
    };
  }
}
