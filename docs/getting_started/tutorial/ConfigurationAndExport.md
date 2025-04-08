# Nexus: Module Configuration and Exporting

## Overview
This section covers `export-config.js`, `module-info.json`, and exporting your module.

```
root
+-- src/
    +-- export-config.js
    +-- module-info.json
    +-- ...

+-- ...
```

Located within the `src/` directory of your project are two important files: `export-config.js` and `module-info.json`. These files are used during both production and exporting.

## `export-config.js`
Note: Paths within this file are relative from the `src/` directory, **not the root directory of the project**.

This file stores important constants to your module and defines how your module is exported.


```javascript
// export-config.js from Nexus: React Template

module.exports = {
    excluded: ["./renderer/react-wrapper"],
    included: ["./renderer/react-wrapper/react_module"],
    build: {
        name: "Sample React Module",
        id: "developer.Sample_React_Module",
        process: "./process/main",
        replace: [
            {
                from: "{EXPORTED_MODULE_ID}",
                to: "%id%",
                at: ["./process/main.ts", "./renderer/renderer.ts"]
            },
            {
                from: "{EXPORTED_MODULE_NAME}",
                to: "%name%",
                at: ["./process/main.ts", "./module-info.json"]
            }
        ]
    }
}
```

Although the templates are pre-configured, you’ll still need to update `build.name` and `build.id` to reflect your module’s information. See the documentation below for specific rulesets about naming.


Taken from the [export-config.js documentation](../../api/export-config.js.md):
> #### `build` > `name: string`
> The display name of your module.
> - `name` cannot be undefined.
> - `name` must be a string.
> - `name` cannot only contain whitespace or be an empty string.
> 
> #### `build` > `id: string`
> The ID of your module.
> - `id` cannot be undefined.
> - `id` must be a string.
> - `id` must be in the format `<developer_name>.<module_name>`
>   - `id` must have one (and only one) period ('.') separating the developer name and the module name.
>   - `id` cannot contain whitespace or be an empty string.
>   - `id` cannot contain special characters besides a single period ('.') and underscores ('_').

---
In `build.replace`, you can define placeholder values and specify where they should be replaced during export. This helps avoid hardcoding values, like `module name` or `module ID`, across multiple files.


## `module-info.json`
This file contains metadata about your module that Nexus reads when loading it. It is also used to check whether your module should be recompiled; compiling your module every time Nexus opens would be excessive, so if there are any changes made within this file, it indicates that your module should be recompiled.

```json
// module-info.json from Nexus: React Template
{
    "name": "{EXPORTED_MODULE_NAME}",
    "author": "developer",
    "version": "1.0.0",
    "description": "A template to create a module for Nexus using React.",
    "build_version": 1,
    "platforms": ["win32", "linux", "darwin"]
}
```
Notice how `name` is `"{EXPORTED_MODULE_NAME}"`; similar to the process, we can replace this file during module exporting so all these values remain the same.

Unlike `export-config.js`, most of these properties have no restrictions on naming. Use this to describe your module!

Here are the properties that have need special information:
- `build_version`: This value is automatically incremented each time you run npm run export. Nexus uses it to detect changes and trigger a recompile.
- `platforms`: While Nexus is cross-platform, there are some dependencies that may not work across all operating systems. You should list the operating systems your module can (or is expected to) run on. Possible values are: `win32` (Windows), `linux` (Linux), and `darwin` (MacOS).

## Exporting your module
Once you’ve configured `export-config.js`, you can export your module for production by running the following command from the root directory of your project:

```
npm run export
```

To export your module. This will open a file picker where you can choose the location to save your module; if no location is chosen (via the `cancel` or `x` button), it will save it in an `output/` folder in the root directory of your project.

Your module will be exported as `<id>.zip`, where `<id>` is the `id` defined in `export-config.js`. This should NOT be modified.

And that's it! You can easily distribute this `.zip` to the Nexus marketplace and import it into your Nexus client from the Settings.