import { HTTPStatusCodes } from "./HTTPStatusCodes";

export interface DataResponse {
    code: HTTPStatusCodes,
    body: any
}