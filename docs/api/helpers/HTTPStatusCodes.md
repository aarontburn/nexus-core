# Nexus: `HTTPStatusCodes`
## Overview
This enum provides all HTTP status codes and their meaning. For more information about each code, view [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status).

## Example

```typescript
import { HTTPStatusCode } from "@nexus/nexus-module-builder";
// ...
public async handleExternal(...) {
    switch (eventType) {
        // ...
        case "get-accent-color": {
            return { 
                body: this.getSettings().findSetting("accent_color").getValue(), 
                code: HTTPStatusCode.OK };
        }
        default: {
            return { 
                body: undefined, 
                code: HTTPStatusCode.NOT_IMPLEMENTED };
        }

    }
}
```