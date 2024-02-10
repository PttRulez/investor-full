import { CreateOpinionData } from "../zod";
import { IExpertResponse } from "./expert";

export type IOpinionResponse = CreateOpinionData & {
  expert?: IExpertResponse;
};
