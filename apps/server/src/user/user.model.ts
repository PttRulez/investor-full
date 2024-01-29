import { User as DbUser } from 'database';
import { verify } from 'argon2';
import { Role } from 'contracts';

export class User {
  id: number;
  email: string;
  name: string;
  role: Role;
  private _hash: string;

  constructor(dbModel: DbUser) {
    this.id = dbModel.id;
    this.name = dbModel.name;
    this.email = dbModel.email;
    this.role = dbModel.role as Role;
    this._hash = dbModel.hashedPassword;
  }

  async validatePassword(password): Promise<boolean> {
    const validated = await verify(this._hash, password);
    return validated;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
