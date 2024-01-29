import { Role } from '../other/enums';

export interface IUserResponse {
	id: number;
	name: string;
	email: string;
	role: Role;
}

