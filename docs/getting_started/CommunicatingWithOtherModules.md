# Nexus: Inter-Module Communication

## Overview
In the Nexus environment, you can expose an API for other modules to communicate with, as well as communicate with other modules.

## Exposing an API
Within your process, you can override the function `handleExternal` to expose an API to other modules.

```typescript
// src/process/main.ts

export default SampleProcess extends Process {
    // ...

    public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<any> {
        // ...
    }

    // ...

}
```

Event handling in `handleExternal` works similarly to the `handleEvents` function, which handles events sent from the renderer. However, the key difference is the `source` parameter — this represents the module attempting to access your API and can be identified using `source.getIPCSource()`. You can use this to restrict access to certain functionality or adjust behavior based on the calling module.

Any data you return from `handleExternal` will be sent back to the caller as a response.

For example, this is the `handleExternal` of the Settings module.

```typescript
public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<any> {
    switch (eventType) {
        case 'isDeveloperMode': {
            return this.getSettings().findSetting('dev_mode').getValue() as boolean;
        }
        case 'listenToDevMode': {
            const callback: (isDev: boolean) => void = data[0];
            this.devModeSubscribers.push(callback);
            callback(this.getSettings().findSetting('dev_mode').getValue() as boolean);
            break;
        }
        case "getAccentColor": {
            return this.getSettings().findSetting("accent_color").getValue();
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
        super.initialize(); // This should be called.

        this.refreshAllSettings();
        // Request the accent color from the built-in 'Settings' module and send it to the renderer.
        this.requestExternal("built_ins.Settings", "getAccentColor").then(value => {
            this.sendToRenderer("accent-color-changed", value)
        });
    }

    // ...

}
```

## Best Practices
### Accessing other modules

- **Never** send a direct reference of your process to any module that requests it. 