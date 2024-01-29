import { MoexBond } from '../bonds/bond.model';
import { MoexShare } from '../shares/share.model';

export * from './iss-api';
export * from './repository';

export type MoexSecurity = MoexBond | MoexShare;
