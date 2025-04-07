# Nexus: The Process

## What is the Process?
The process is the backend of your module. It has no access to the DOM, and sends/receive data from the renderer process. However, it has full access to the Node.js API, file system, and external packages (through services like `npm`).


## Getting Started:
By default, the process is located in the `src/process` directory as `main.ts`.

Let's break down critical parts of this file.

### Imports
```typescript
// src/process/main.ts
//...

import { Process, Setting } from "@nexus/nexus-module-builder";
import { BooleanSetting } from "@nexus/nexus-module-builder/settings/types";

// ...
```
There is a set of classes and functions within `@nexus/nexus-module-builder` that may be useful to developing your module. Visit the [Process API](../../api/Process.md) to learn about all the available classes.


### Module Information
```typescript
// src/process/main.ts
// ...

// These is replaced to the ID specified in export-config.js during export. DO NOT MODIFY.
const MODULE_ID: string = "{EXPORTED_MODULE_ID}";
const MODULE_NAME: string = "{EXPORTED_MODULE_NAME}";
// ---------------------------------------------------
const HTML_PATH: string = path.join(__dirname, "../renderer/index.html");
// const ICON_PATH: string = path.join(__dirname, "...");
const ICON_PATH: string = undefined;

// ...
```
These constants are used to identify and create your module. 

- `MODULE_ID`: The ID of your module, usually in the form `<developer_name>.<module_name>`. Cannot contain whitespace or special characters, besides underscores.
- `MODULE_NAME`: The display name of your module. Can contain white spaces.
- `HTML_PATH`: The relative path to the renderers HTML file.
- `ICON_PATH`: The relative path to the modules icon. If this is undefined, the icon is replaced by the abbreviation of the `MODULE_NAME`. 
    - Can be a `svg`, `png`, `jpg`, or `jpeg`.

You may have noticed that `MODULE_ID` and `MODULE_NAME` are `"{EXPORTED_MODULE_ID}"` and `"{EXPORTED_MODULE_NAME}"`, respectively. These values are replaced during module building to the values defined in `export-config.js` (learn more [here](link)) and **should not be modified.**


### The Process Class
```typescript
// src/process/main.ts
// ...

export default class SampleProcess extends Process {

    public constructor() {
        super(MODULE_ID, MODULE_NAME, HTML_PATH, ICON_PATH);
    }

    public initialize(): void {
        super.initialize(); // This should be called.
        // ...
    }

    // ...
}

// ...
```
This class contains all the logic relevant for your Process. The class name (`SampleProcess` by default) is not important and can be changed. However, it is important that this class is the `default` export and extends the parent class `Process`.

Notice how the `constructor` is very bare-bones. While the `constructor` is the entry point to your module, it takes time for the renderer to be initialized. Therefore, your `constructor` should NOT have logic that is pertinent to your GUI.

On the other hand, the `initialize` method is (by default) called when the renderer is initialized. This is where you can begin communicating with your renderer.

#### Renderer Event Handling
```typescript
// src/process/main.ts
// ...

export default class SampleProcess extends Process {
    // ...

    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        switch (eventType) {
            // This is called when the renderer is ready to receive events.
            case "init": {
                this.initialize();
                break;
            }
            case "count": {
                console.info("Sample React App: Received 'count': " + data[0]);
                break;
            }

            default: {
                console.info(`Sample React App: Unhandled event: eventType: ${eventType} | data: ${data}`);
                break;
            }
        }
    }
    // ...
}

// ...
```
This is the function that receives messages sent from your renderer.
- `eventType`: The name of the event as a `string`.
- `data`: Any data sent back from your renderer as an array.

Notice how we handle `"init"` here. When the renderer finishes initialization, it will send an event with an `eventType` of `"init"`, which is how we know our renderer is ready. You can change when your process will initialize, but there isn't much reason to do so. You can also use `if` statements instead of `switch-case`, if you prefer.

Notice how the return type is `Promise<any>`. If you need to reply back to the renderer after receiving an event, anything that you `return` here will be replied, which can be handled in the renderer using `.then(...)`.

#### Settings
```typescript
// src/process/main.ts
// ...

export default class SampleProcess extends Process {
    // ...

    public registerSettings(): (Setting<unknown> | string)[] {
        return [
            "Sample Setting Group",
            new BooleanSetting(this)
                .setDefault(false)
                .setName("Sample Toggle Setting")
                .setDescription("An example of a true/false setting.")
                .setAccessID('sample_bool'),

        ];
    }


    public refreshSettings(modifiedSetting: Setting<unknown>): void {
        if (modifiedSetting.getAccessID() === "sample_bool") {
            this.sendToRenderer('sample-setting', modifiedSetting.getValue());
        }
    }

    // ...
}

// ...
```
The Nexus API provides an quick and easy way to add settings that the user may want to tweak. The `registerSettings` function 