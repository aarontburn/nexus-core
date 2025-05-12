# Nexus: `module-info.json` API
## Overview

This file defines module metadata and the export configuration for your module. You define your module ID and module name here, and you can use it to replace specific values in your code during export. You can also remove/include files in your exported module.

All paths are relative to the project's `src/` directory,

If any of the required fields are missing, your module will throw an error on export.

```
root
+-- src/
    +-- module-info.json
    +-- ...

+-- ...
```

```jsonc
// module-info.js from Nexus: React Template
{
    "name": "Sample React Module",
    "id": "developer.Sample_React_Module",
    "version": "1.0.0",
    "author": "developer",
    "description": "A template to create a module for Nexus using React.",
    "link": "https://github.com/aarontburn/nexus-template-react",
    "platforms": ["win32", "linux", "darwin"],
    "build": {
        "process": "./process/main.js",
        "build-version": 1,
        "excluded": ["electron.ts", "./renderer/react-wrapper"],
        "included": ["./renderer/react-wrapper/react_module"],
        "replace": [
            {
                "from": "{EXPORTED_MODULE_ID}",
                "to": "%id%",
                "at": ["./process/main.ts", "./renderer/renderer.ts"]
            },
            {
                "from": "{EXPORTED_MODULE_NAME}",
                "to": "%name%",
                "at": ["./process/main.ts"]
            }
        ]
    }
}
```

## API
### `name: string` (*required*)
The display name of your module.
- `name` cannot be undefined.
- `name` must be a string.
- `name` cannot only contain whitespace or be an empty string.


### `id: string` (*required*)
The ID of your module.
- `id` cannot be undefined.
- `id` must be a string.
- `id` must be in the format `<developer_name>.<module_name>`
  - `id` must have one (and only one) period ('.') separating the developer name and the module name.
  - `id` cannot contain whitespace or be an empty string.
  - `id` cannot contain special characters besides a single period ('.') and underscores ('_').


### `version: string` (*required*)
The [semantic version](https://docs.npmjs.com/about-semantic-versioning) of your module. 

- `version` cannot be undefined.
- `version` must be a string
- `version` must be in the format `x.y.z`, where `x`, `y`, and `z` are version numbers. 
  

### `author: string`
The name of the developer or organization.

### `description: string`
A short description about your module.

### `link: string`
A link to your module's homepage or repository.

### `platforms: string[]`
The OS platforms your module can run on.

- `"win32"` for Windows
- `"linux"` for Linux
- `"darwin"` for macOS


### `build: object` (*required*)
The `build` object contains details how your module will export.
- `build` cannot be undefined.
- `build` must be an object.

#### `build` > `process: string` (*required*)
The relative path to the main process of your module.
- `process` cannot be undefined.
- `process` must be a string.
- `process` cannot only contain whitespace or be an empty string.

#### `build` > `build-version: number` (*required*)
A integer that is incremented when your module is exported. This value is automatically updated and should not be modified manually.


#### `build` > `excluded?: string[]`
Lists the relative paths of files to exclude from the exported module. This can be omitted if no files need to be excluded.
- `excluded` must be an array of strings, an empty array, or undefined.

#### `build` > `included?: string[]`
Lists the relative paths of files to include to the exported module. This can be omitted if no files need to be included. This will add the specified files in the root directory of exported module (equivalent to putting them in the `src/` directory in development).
- `included` must be an array of strings, an empty array, or undefined.



#### `build` > `replace?: ReplacementObject[]`

```typescript
interface ReplacementObject {
    from: string,
    to: string,
    at: string[]
}
```

A list of replacement objects to be evaluated. This is to replace certain values within your code during export.

For example, this is used to replace all `"{EXPORTED_MODULE_ID}"` and `"{EXPORTED_MODULE_NAME}"` with your modules' `id` and `name`, as defined in this file. This reduces redundancy.

- `replace` must be an array of `ReplacementObject`, an empty array, or undefined.

#### `build` > `replace` > `{from}: string`
The value to replace.
- `{from}` cannot be undefined.
- `{from}` must be a string (however, this does not mean this can only replace strings within your code).
  

#### `build` > `replace` > `{to}: string`
The replacement value.
- `{to}` cannot be undefined.
- `{to}` CAN be an empty string.
- if `{to}` is surrounded by `%`, take the property within the `%` from the `build` object.


#### `build` > `replace` > `{at}: string[]`
A list of paths where the replacement should occur. These paths are relative to the `src/` directory.
- `{at}` cannot be undefined.
- `{at}` must be an array of strings or an empty array.

