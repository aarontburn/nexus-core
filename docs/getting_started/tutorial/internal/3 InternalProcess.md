# Nexus: Internal Process

## Overview
### Read the [Process](../ProcessOverview.md) for details on how the process works.

An internal module doesn't have a GUI, which means there isn't a renderer associated with your module. This means functions, such as `this.sendToRenderer` does not do anything. 



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
Notice how the third argument, which is normally the path to the HTML file in the renderer, is undefined. This is what Nexus will consider an internal module.

#### Initialization
You also may notice the absence of the `handleEvent` function. The `handleEvent` function is strictly to listen to events from the renderer, and because there is no renderer, we don't need to handle any events.

This also means that we aren't waiting for the renderer to initialize before we run the process' `initialize` function. Instead, internal modules are initialized as soon as 