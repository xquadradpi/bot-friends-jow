import { ResultType } from "./result-types.enum";

export interface SuccessfulResult<TValue> {
    type: ResultType.OK;
    value: TValue;
}
