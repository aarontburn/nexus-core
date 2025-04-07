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


### Module Info
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
- `ICON_PATH`: The relative path to the modules icon. If this is undefined, the icon is replaced by the abbreviation of the `MODULE_NAME`. Can be a `svg`, `png`, `jpg`, or `jpeg`.

You may have noticed that `MODULE_ID` and `MODULE_NAME` are `"{EXPORTED_MODULE_ID}"` and `"{EXPORTED_MODULE_NAME}"`, respectively. These values are replaced during module building to the values defined in `export-config.js` (learn more [here](link)) and **should not be modified.**


