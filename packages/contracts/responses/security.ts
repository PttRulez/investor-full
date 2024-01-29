import { Exchange } from '../other/enums';
import { IMoexSecurtiyResponse } from './moex-securities';

type BaseSecurity = { exchange: Exchange }
export type SecurityResponse = BaseSecurity & IMoexSecurtiyResponse;
