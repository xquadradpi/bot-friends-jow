import { ResultType } from "./result-types.enum";

export interface NotFoundResult<TError = never> {
    type: ResultType.NotFound;
    error?: TError;
}
