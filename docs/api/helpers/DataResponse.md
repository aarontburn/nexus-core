# Nexus: `DataResponse`


## Overview
At the moment, this interface is used as the result type during Inter-Module Communication (communicating between two different modules) to communicate the status of the call. 

```typescript
export interface DataResponse {
    code: HTTPStatusCode,
    body: any
}
```
> **Parameters**  
> `code: HTTPStatusCode` → An [HTTP response status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) code about the completion status of the call. See the [`HTTPStatusCode`](./HTTPStatusCodes.md) enum.  
> `body: any` → The result body.


## Example
The example event handler for a module that hasn't set up an external API.

The code is `HTTPStatusCode.NOT_IMPLEMENTED` (501).

```typescript
public async handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<DataResponse> {
    return { code: HTTPStatusCode.NOT_IMPLEMENTED, body: undefined };
}
```