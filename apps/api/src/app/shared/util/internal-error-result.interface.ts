import { ResultType } from "./result-types.enum";

export interface InternalErrorResult<TError = never> {
    type: ResultType.InternalError;
    error?: TError;
}