# Nexus: Internal Process

## Overview
### Read the [Process](../ProcessOverview.md) for details on how the process works.

An internal module doesn't have a GUI, which means there isn't a renderer associated with it. As a result, functions like `this.sendToRenderer()` won't do anything. 

```typescript
// src/process/main.ts

// ...
export default class SampleProcess extends Process {
    public constructor() {
        super(MODULE_ID, MODULE_NAME, undefined);
    }

    // ...
}
```
Notice how the third argument — typically the path to your renderer's HTML file — is set to `undefined`. This is what Nexus will consider an internal module.



#### Initialization
You also may notice the absence of the `handleEvent` function. The `handleEvent` function is strictly to listen to events from the renderer, and because there is no renderer, we don't need to handle any events.

This also means that we aren't waiting for the renderer to initialize before we run the process' `initialize` function. Instead, internal modules are initialized shortly after the Nexus application finishes loading.

---
Internal modules can still do everything other modules can do, just without a GUI. You can still create settings and have them display in the Settings, or interact with other classes.

For next steps, visit the [Internal Renderer](./3%20InternalRenderer.md) page.