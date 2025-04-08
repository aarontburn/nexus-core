import { HTTPStatusCode } from "./HTTPStatusCodes";

export interface DataResponse {
    code: HTTPStatusCode,
    body: any
}