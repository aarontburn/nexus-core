# Nexus: Inter-Module Communication

## Overview
In the Nexus environment, you can expose an API for other modules to communicate with, as well as communicate with other modules.

## `DataResponse`
Inside` @nexus/nexus-module-builder`, you'll find two key tools for module communication: the `DataResponse` object (similar to an HTTP Response), and the `HTTPStatusCode` enum, which provides all standard HTTP status codes.

```typescript
interface DataResponse {
    code: HTTPStatusCode,
    body: any
}
```

## Exposing an API
Within your process, you can override the function `handleExternal` to expose an API to other modules.

```typescript
// src/process/main.ts

export default SampleProcess extends Process {
    // ...

    public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
        // ...
    }

    // ...

}
```

Event handling in `handleExternal` works similarly to the `handleEvents` function, which handles events sent from the renderer. However, the key difference is the `source` parameter — this represents the module attempting to access your API and can be identified using `source.getIPCSource()`. You can use this to restrict access to certain functionality or adjust behavior based on the calling module.

Any data you return from `handleExternal` will be sent back to the caller as a response.

For example, this is the `handleExternal` of the Settings module.

```typescript
public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
    switch (eventType) {
        case 'is-developer-mode': {
            return { 
                body: this.getSettings().findSetting('dev_mode').getValue() as boolean, 
                code: HTTPStatusCode.OK 
            };
        }
        case 'on-developer-mode-changed': {
            const callback: (isDev: boolean) => void = data[0];
            this.devModeSubscribers.push(callback);
            callback(this.getSettings().findSetting('dev_mode').getValue() as boolean);

            return { 
                body: undefined, 
                code: HTTPStatusCode.OK 
            };
        }
        case "get-accent-color": {
            return { 
                body: this.getSettings().findSetting("accent_color").getValue(), 
                code: HTTPStatusCode.OK 
            };
        }
        default: {
            return { body: undefined, code: HTTPStatusCode.NOT_IMPLEMENTED };
        }

    }
}
```

## Accessing other modules' API
Within your process, you can use the function `this.requestExternal()` to make requests to other modules.

`requestExternal(target: string, eventType: string, ...data: any[])`
- `target`: The ID of the target module.
- `eventType`: The request type.
- `data`: Any data associated with the request.


```typescript
// Nexus: React Template => src/process/main.ts

export default SampleProcess extends Process {
    // ...

    public initialize(): void {
        super.initialize();

        this.refreshAllSettings();
        // Request the accent color from the built-in 'Settings' 
        // module and send it to the renderer.
        this.requestExternal("nexus.Settings", "get-accent-color").then(value => {
            this.sendToRenderer("accent-color-changed", value)
        });
    }

    // ...
}
```
You can find the ID from within the Settings tab, or requesting it from the main process.

```typescript
const installedModules: string[] = await this.requestExternal("nexus.Main", "get-module-IDs")
console.log(installedModules.body)
```

## Best Practices

- **Never** send a direct reference of your process (like `this`) to any module that requests it. This can lead to unintended side effects or security issues
- When returning arrays or objects, use the spread operator (`[...arr]` or `{...obj}`) to ensure you're sending a copy, not a reference. This prevents external modules from mutating your internal state.